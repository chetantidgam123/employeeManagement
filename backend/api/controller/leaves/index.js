const multer = require('multer');
const path = require('path');
const { authorize, authorizeAdmin } = require('../../../_middleware')
const {getTotalLeavesData, apply_leave, apply_leave_schema, getLeaveByEmpIdAndMonth_schema, getLeaveByEmpIdAndMonth, getEmpWhoAplLeave_schema, getEmpWhoAplLeave, getEmpLeaveDateRange_schema, getEmpLeaveDateRange, updateEmpLeave, updateEmpLeave_schema, getLeavesList_schema, getLeavesList, } = require('./post')
// const { getTotalLeavesData } = require('./get');
const { _delete } = require('./delete');

module.exports = (model, { config }) => {
    const router = config.express.Router();
    const
        storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.fieldname == 'profile_photo') {
                    cb(null, 'uploads/profilepics');
                } else {
                    cb(null, 'uploads/');
                }
            },
            filename: function (req, file, cb) {

                cb(null, Date.now() + path.extname(file.originalname));
            },
        });
    function fileFilter(req, file, cb) {
        const allowedExtensions = ['.jpeg', '.jpg', '.png', '.yaml', '.json', '.pdf'];

        // Check if the file extension is in the allowedExtensions array
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Invalid file extension.'), false); // Reject the file
        }
    }
    const upload = multer({ storage: storage, fileFilter: fileFilter, });
    // ********************* employee *****************************
    router.post('/apply_leave', authorize(), apply_leave_schema, apply_leave(model, { config }));
    router.post('/getLeaveByEmpIdAndMonth', authorize(), getLeaveByEmpIdAndMonth_schema, getLeaveByEmpIdAndMonth(model, { config }));
    router.post('/getleaveslist', authorize(), getLeavesList_schema, getLeavesList(model, { config }));
    router.post('/getTotalLeavesData', authorize(),getTotalLeavesData(model, { config }));
    router.delete('/delete_leave/:id', authorize(), _delete(model, { config }));


    // ********************* admin *****************************
    router.post('/getEmpLeaveDateRange', authorizeAdmin(), getEmpLeaveDateRange_schema, getEmpLeaveDateRange(model, { config }));
    router.post('/getEmpWhoAplLeave', authorizeAdmin(), getEmpWhoAplLeave_schema, getEmpWhoAplLeave(model, { config }));
    router.post('/updateEmpLeave', authorizeAdmin(), updateEmpLeave_schema, updateEmpLeave(model, { config }));
    return router;
};