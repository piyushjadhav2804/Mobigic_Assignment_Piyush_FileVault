const User = require('../model/user');
const shortid = require('shortid');
const path = require('path');

module.exports.profile = (req, res) => {
  
  User.findById(req.params.id).then((user) => {
    res.render("user_profile", {
      title: "Mobigic | Profile Page",
      profile_user: user,
    });
  });
};

//render the sign up page
module.exports.signUp = function (req, res) {

  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/:id");
  }

  return res.render("user_sign_up", {
    title: "Mobigic | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {

  if(req.isAuthenticated()) {
    return res.redirect('/users/profile/:id');
  }
    
  return res.render("user_sign_in", {
    title: "Mobigic | Sign In",
  });
};

//get the sign up data
module.exports.create = function (req, res) {

    if (req.body.password != req.body.confirm_password) {
       console.log("Passwords did not match");
       return res.redirect("back");
    }

    User.findOne({email: req.body.email}).then((user) => {

        if(user) {
            console.log("User not added as email is already taken!!");
            return res.redirect("back");
        }

        else {
            User.create(req.body);
            console.log('User added successfully');
            return res.redirect('back');
        }
    })
};

//sign in and create session for the user
module.exports.createSession = function (req, res) {
    return res.redirect('/');
};


//sign out
module.exports.destroySession = function (req, res) {
    req.logout(function() {
      console.log("User logged out!!");
    });

    return res.redirect('/users/sign-in');
}

module.exports.upload = async function(req, res) {

    if(req.user.id == req.params.id) {

      try {

        let user = await User.findById(req.params.id);

        User.uploadedFile(req, res, function(err) {

          if(err) { console.log('Multer error: ', err); }

          // console.log(req.file);

          if(req.file) {
            // const fileId = shortid.generate();
            const fileId = Math.floor(100000 + Math.random() * 900000).toString();
            const fileName = req.file.filename;
            const filePath = User.filePath + "/" + fileName;

            // console.log('fileID: ', fileId);

            // Add the uploaded file details to the user's files array
            user.file.push({ fileId, fileName, filePath });
            user.save();
          }

          return res.redirect('back');
        })
      }

      catch {
        return res.redirect('back');
      }
    }

    else {
      return res.status(401).send('Unauthorized');
    }
}


module.exports.download = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);

    const fileId = req.params.fileId;
    const file = user.file.find((file) => file.fileId === fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const providedCode = req.body.code;
    const actualCode = file.fileId;

    if (providedCode !== actualCode) {
      return res.status(401).send("Incorrect code");
    }

    const filePath = path.join(__dirname, "..", file.filePath);
    res.download(filePath, file.fileName);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports.delete = async function(req, res) {

  try {
    let user = await User.findById(req.user.id);

    const fileId = req.params.fileId;
    const fileIndex = user.file.findIndex((file => file.fileId === fileId));

    if(fileIndex == -1) {
      return res.status(404).send("File not found");
    }

    user.file.splice(fileIndex, 1);

    user.save();

    return res.redirect('back');
  }

  catch(err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}