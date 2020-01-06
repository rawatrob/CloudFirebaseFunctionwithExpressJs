const functions = require('firebase-functions')
var firebase = require('firebase');
var express = require('express');
var bodyParser = require("body-parser");

const uuidv4 = require('uuid/v4');
const uuid = uuidv4();
var stream = require('stream');
const os = require('os')
const path = require('path')
const cors = require('cors')({ origin: true })
const Busboy = require('busboy')
const fs = require('fs')
//const data  = fs.readFileSync('base64', 'utf8');
var ba64 = require("ba64")
var admin = require("firebase-admin");

let config = {


};
var serviceAccount = {
  
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "x"
});


firebase.initializeApp(config);

const db = firebase.firestore();


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function getList(q) {
  var getListData = [];
  const snapshot = await firebase.firestore().collection(q).get()

  return snapshot.docs.map(doc => {
    const data = doc.data();
    const id = doc.id;
    return { id, data };
  });
}


app.get('/AllImage', (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  db.collection("admin").doc("allData").get().then((doc) => {
    return response.json(doc.data())
  }).catch((err) => {
    return err;
  })

});

// app.get('/UpdateImageInDb', (req, response) => {
//   response.set('Access-Control-Allow-Origin', '*');
//   var key = 89
//   var usersUpdate = {};
//   usersUpdate[`pattern.` + key] = true;
//   db.collection("left_Design_Elements").doc("Backgrounds").update(

//     usersUpdate
//   )
//   return response.json({ "done": "rrrr" });

// })
app.get('/UpdateImageInDb', (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  // //var key = 1
  // var usersUpdate = {};
  // usersUpdate['Color.x.1']="2"
  dataUpdate(a, b);
  //  db.collection("left_Design_Elements").doc("Backgrounds").update(
  //   { req.body.cat: firebase.firestore.FieldValue.arrayUnion(value)}

  // )
  return response.json({ "done": "rrrr" });

})



// DOC // COLLECTION // KEY-VALUE // imagePath
function dataUpdate(doc, key, value) {
console.log("------->>>",value);
  db.collection("left_Design_Elements").doc(doc).update(
          { [key]: firebase.firestore.FieldValue.arrayUnion(value) }
        )
  }

app.get('/setDataInDb', (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');


  var data = {
    "color": ["#F5F3F2", "#F5DF07", "#FF00E8", "#003EFF", "#FF0023"],
    "color_gradient": [{ "1": "#F5F3F2", "2": "#F5DF07", "3": "horizontal", "4": "to right" }],
    "pattern": []
  }


  return db.collection("left_Design_Elements").doc("Backgrounds").set(data)
    .then(() => {
      return response.json({ "Data": "Done" })
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

})




app.get('/get_Design_Element', async (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  var x = await getList('left_Design_Elements');
  console.log(x)
  return response.json(x)
});

app.get('/CatList', async (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  var x = await getList('CatList');
  return response.json(x)
});

app.post('/alluserdata', (req, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  return response.json({ "data": req.body.Name })
});






app.post('/uploadFile',async (req, response) => {
  var Uid = Date.now()
  response.set('Access-Control-Allow-Origin', '*');
 // var randomnumb =(Math.floor(Math.random() * 1000000000));\
 
   console.log("---++++{}{}{--->>>>>",Uid)    
  if (typeof neverDeclared === "undefined") // no errors
    if (typeof req.body.category === "undefined" || req.body.category === "" || typeof req.body.userId === "undefined" || req.body.userId === "" || typeof req.body.subCategary === "undefined" || req.body.subCategary === "" || typeof req.body.imageId === "undefined" || req.body.imageId === "" || typeof req.body.storeLocation === "undefined" || req.body.storeLocation === "" || typeof req.body.imagePath === "undefined" || req.body.imagePath === "") {
      return response.json({ "data": 'Somthing went wrong please try again' })
    }
    else {
      ba64.writeImageSync('/tmp/myimage'+Uid, req.body.imagePath); // Saves myimage.jpeg.


     await ba64.writeImage('/tmp/myimage'+Uid, req.body.imagePath, (err) => {
        if (err) throw err;

 console.log("Image saved successfully",'/tmp/myimage'+Uid);
        var folderLocation = req.body.userId + "/" + req.body.category + "/" + req.body.subCategary + "/"
        const bucket = admin.storage().bucket();
        var destination = folderLocation + req.body.imageId + "/" + Uid;
        return bucket.upload('/tmp/myimage'+Uid+'.jpeg', {
          uploadType: 'media',
          destination: destination,
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: Uid,
              contentType: 'image/png',
            },
          },
        }).then((data) => {

          var getData = data[0];
          var folderName = req.body.userId + "%2F" + req.body.category + "%2F" + req.body.subCategary;
          var DestinationName = req.body.imageId + "%2F" + Uid;
//          var destination = folderName + "/" + DestinationName;
          var showpath = folderName + "%2F" + DestinationName;


          var imagePath = "https://firebasestorage.googleapis.com/v0/b/appydesigne.appspot.com/o/" + showpath;
          var commonAtr = "?alt=media&token="
          var Tokens = getData.metadata.metadata.firebaseStorageDownloadTokens
          var imageUrl0 = imagePath + commonAtr + Tokens;
          
        // dataUpdate(req.body.storeLocation, imageUrl0 , req.body.imageId)
         dataUpdate(req.body.storeLocation, req.body.imageId, imageUrl0);

          return response.status(200).json({
            imageUrl: imagePath + commonAtr + Tokens,
            message: 'It worked!',

          })

        })

          .catch(err => {
            response.status(500).json({
              error: err,
            })
          })
      })
    }
})


exports.widgets = functions.https.onRequest(app);
