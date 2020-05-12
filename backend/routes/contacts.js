const express = require('express');
const multer = require('multer');
const Contact = require('../models/contact');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid extension type");
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file,cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        console.log(name + '-' + Date.now() + '.' + ext);
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', multer({storage: storage}).single("image"), checkAuth, (req, res, next) => {
    delete req.body._id;
    const contact = new Contact({
        ...req.body,
        creator: req.userData.userId
    });
    if(req && req.file && req.file.filename){     
        const url = req.protocol + '://' +req.get('host');
        contact.imagePath = url + '/images/' + req.file.filename
    }
    contact.save()
        .then(createdContact => {
            res.status(201).json({
                message: "Contact added successfully",
                contactId: createdContact._id
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Creating contact failed!"
            });
        });
});

router.put('/:id', multer({storage: storage}).single("image"), checkAuth, (req, res, next) => {
    delete req.body.creator;
    const contact = new Contact({
        ...req.body,
        creator: req.userData.userId
    });
    if(req && req.file && req.file.filename){     
        const url = req.protocol + '://' +req.get('host');
        contact.imagePath = url + '/images/' + req.file.filename
    }
    Contact.updateOne({_id: req.params.id, creator: req.userData.userId}, contact)
        .then(result => {
            if(result.n > 0){
                res.status(200).json({
                    message: 'Update successful!'
                });
            } else {
                res.status(401).json({
                    message: 'Not authorised!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update Contact!"
            });
        });
});

router.get('', (req,res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const contactQuery = Contact.find();
    let fetchedContacts;
    if(pageSize && currentPage){
        contactQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    contactQuery
        .then(documents => {
            fetchedContacts = documents
            return Contact.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Contacts fetched successfully',
                contacts: fetchedContacts,
                contactsCount: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching contacts failed!"
            });
        });
});

router.get('/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if(contact){
                res.status(200).json(contact);
            } else {
                res.status(404).json({
                    message: 'Contact not found!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching contact failed!"
            });
        });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Contact.deleteOne({_id : req.params.id, creator: req.userData.userId})
        .then(result => {
            if(result.n > 0){
                res.status(200).json({
                    message: 'Deletion successful!'
                });
            } else {
                res.status(401).json({
                    message: 'Not authorised!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Deleting contact failed!"
            });
        });
});

module.exports = router;