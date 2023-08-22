//user_controller.js

//require necessary modules
const User = require('../model/user');
const shortid = require('shortid');
const path = require('path');

// Controller to render the user profile page.
module.exports.profile = (req, res) => {
  
  User.findById(req.params.id).then((user) => {
    res.render("user_profile", {
      title: "Mobigic | Profile Page",
      profile_user: user,
    });
  });
};

// Controller to render the sign up page.
module.exports.signUp = function (req, res) {

  //If already authenticated, redirects to user profile.
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/:id");
  }

  return res.render("user_sign_up", {
    title: "Mobigic | Sign Up",
  });
};

// Controller to render the sign in page.
module.exports.signIn = function (req, res) {

  //If already authenticated, redirects to user profile.
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/:id");
  }

  return res.render("user_sign_in", {
    title: "Mobigic | Sign In",
  });
};

// Controller to handle user registration.
module.exports.create = function (req, res) {

    // Validates password match
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

// Controller to create session after successful sign-in.
module.exports.createSession = function (req, res) {
    return res.redirect('/');
};


// Controller to destroy session and log out the user.
module.exports.destroySession = function (req, res) {
    req.logout(function() {
      console.log("User logged out!!");
    });

    return res.redirect('/users/sign-in');
}

// Controller to handle file upload for a user.
module.exports.upload = async function(req, res) {

    if(req.user.id == req.params.id) {

      try {

        let user = await User.findById(req.params.id);

        User.uploadedFile(req, res, function(err) {

          if(err) { console.log('Multer error: ', err); }

          // console.log(req.file);

          if(req.file) {
            // const fileId = shortid.generate();

            // Generates a unique 6-digit code for the file.
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

// Controller to handle file download for a user.
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

    // Validates the 6-digit code before allowing download.
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

// Controller to handle file deletion for a user.
module.exports.delete = async function(req, res) {

  try {
    let user = await User.findById(req.user.id);

    const fileId = req.params.fileId;
    const fileIndex = user.file.findIndex((file => file.fileId === fileId));

    if(fileIndex == -1) {
      return res.status(404).send("File not found");
    }

    //removes file from the array
    user.file.splice(fileIndex, 1);

    user.save();

    return res.redirect('back');
  }

  catch(err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}