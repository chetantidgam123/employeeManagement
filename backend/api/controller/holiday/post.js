const db = require("../../../_helpers/db");
const { validateRequest } = require("_middleware/validate-request");
const Joi = require("joi");
const { QueryTypes } = require("sequelize");



// *******************  Employee Apis ****************



// ****************  Admin Apis  ******************* 

const addHoliday =
  ({ holidayModel }, { config }) =>
    async (req, res, next) => {
      const { date, color, title, description,holiday_id } = req.body;
        try {
          if(holiday_id && holiday_id>0){
            const update_docQuery = `UPDATE public."holidays" SET date=?,color=?,title=?,description=?,updatedat=? WHERE holiday_id=? RETURNING "holiday_id"`;
            const [,updateatt] = await db.sequelize.query(update_docQuery, {
              replacements: [date,color,title,description,new Date(),holiday_id],
              type: QueryTypes.UPDATE,
            });
            if(updateatt > 0){
              return res.json({
                status: true,
                code: 200,
                message: "Holiday Updated Succefully",
              });
            }else{

            }
          }else{
          const inserholidayQuery = `INSERT INTO public."holidays"(date,color,title,description,createdat,updatedat) VALUES (?, ?, ?, ?, ?, ?) RETURNING "holiday_id"`;
          const [rowOut] = await db.sequelize.query(inserholidayQuery, {
        replacements: [date,color,title,description,new Date(),new Date()],
        type: QueryTypes.INSERT,
      });
      const _holiday_id = (rowOut && rowOut.length > 0 && rowOut[0] ? rowOut[0].holiday_id : 0);
      if(_holiday_id>0){
        return res.json({
          status: true,
          code: 200,
          message: "Holiday Added Succesfully",
        })
      }else{
        return res.json({
          status: false,
          code: 404,
          message: "Unable to save, Please try again",
        })
      }
    }

        } catch (err) {
          next(err);
        }

    };

function add_Holiday_schema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().trim().required(),
    color: Joi.string().trim().allow(''),
    title: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().max(500).allow(''),
    holiday_id:Joi.number()
  });
  validateRequest(req, next, schema);
}

const toggleHoliday=({ holidayModel }, { config }) =>
async (req, res, next) => {
const {is_active,holiday_id} =req.body
  try {
    const update_docQuery = `UPDATE public."holidays" SET is_active=?,updatedat=? WHERE holiday_id=? RETURNING "holiday_id"`;
    const [,updateatt] = await db.sequelize.query(update_docQuery, {
      replacements: [is_active,new Date(),holiday_id],
      type: QueryTypes.UPDATE,
    });
    if(updateatt > 0){
      return res.json({
        status: true,
        code: 200,
        message: "Holiday Updated Succefully",
      });
    }else{
      return res.json({
        status: false,
        code: 404,
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    next(err);
  }
}
module.exports = {
  addHoliday,
  add_Holiday_schema,
  toggleHoliday
};
