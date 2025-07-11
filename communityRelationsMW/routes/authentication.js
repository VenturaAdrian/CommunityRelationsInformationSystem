var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');

require('dotenv').config();

  var knex = require("knex")({
    client: 'mssql',
    connection: {
      user: process.env.USER,
      password: process.env.PASSWORD,
      server: process.env.SERVER,
      database: process.env.DATABASE,
      port: parseInt(process.env.APP_SERVER_PORT),
      options: {
        enableArithAbort: true,
       
      }
    },
  });

    var db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD,{
      host: process.env.SERVER,
      dialect: "mssql",
      port: parseInt(process.env.APP_SERVER_PORT),
    });

    const { DataTypes } = Sequelize;

    const Users = db.define('users_master',{
      id_master:{
        type:DataTypes.INTEGER,
        primaryKey: true
      },
      user_name:{
        type: DataTypes.STRING
      },
      emp_position:{
        type: DataTypes.STRING
      },
      emp_firstname: {
        type: DataTypes.STRING
      },
      emp_lastname: {
        type: DataTypes.STRING
      },
      emp_email: {
        type: DataTypes.STRING
      },
      emp_role:{
        type: DataTypes.STRING
      },
      pass_word: {
        type: DataTypes.STRING
      },
      created_by: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.STRING
      },
      is_active: {
        type: DataTypes.STRING
      }
    },{
      freezeTableName: false,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: 'users_master'
    })

  router.get('/login', async function (req, res, next) {
    try {
        const user = await Users.findAll({
          where: {
          user_name: req.query.user_name
          }
        });        
         

        if (!user || user.length === 0) {
          return res.status(404).json({ msg: 'User not found' });
        }
        
        if(req.query.password !== user[0].pass_word){
        
          return res.status(401).json({ msg: 'Incorrect password' });
          
        }

        await knex('users_master')
      .where({ id_master: user[0].id_master })
      .update({ is_active: 1 });

        console.log("The username: ", user[0].user_name);
          console.log("Position", user[0].emp_position);
          console.log("First Name: ", user[0].emp_firstname);
        console.log("Last Name: ", user[0].emp_lastname);
        console.log("Role: ", user[0].emp_role);
        console.log("The PWD: ",user[0].pass_word);


        const result = {
          id_master: user[0].id_master,
          user_name: user[0].user_name,
          emp_position: user[0].emp_position,
          first_name: user[0].emp_firstname,
          last_name: user[0].emp_lastname,
          is_active: user[0].is_active,
          role: user[0].emp_role,
        };

        res.json(result);
    } catch (err) {
        console.error("Error during login GET:", err);
        
      }
  });


  

router.get('/users', async function (req, res, next) {
  const result = await knex.select('*').from('users_master');
  res.json(result);
  console.log(result);
});

router.get('/useredit', async (req,res,next)=> {
  try{
    const getUser = await Users.findAll({
      where:{
        id_master: req.query.id
      }
    })
    console.log(getUser)
    res.json(getUser[0]);


  }catch(err){
    console.error('Error fetching user data', err);
    res.status(500).json({error: 'Failed to fetch request'});
  }
}) 

router.get('/logs', async (req, res) => {
  const { start, end } = req.query;

  try {
    let query = knex('users_logs').select('*');

    if (start && end) {
      query = query.whereBetween('time_date', [start, end]);
    }

    const logs = await query.orderBy('time_date', 'desc');
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const updatedBy = req.query.updated_by; // ✅ FIXED

  try {
    const user = await knex('users_master').where('id_master', id).first();
    console.log('USER DATA', user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users_logs').insert({
      user_id: user.id_master,
      emp_firstname: user.emp_firstname,
      emp_lastname: user.emp_lastname,
      updated_by: updatedBy,
      changes_made: `${user.user_name} permanently deleted by ${updatedBy}`,
      time_date: new Date()
    })

    await knex('users_master').where('id_master', id).del();

    res.status(200).json({ message: 'User logged and deleted successfully' });
  } catch (error) {
    console.error('Error logging and deleting user:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/isactivechecker', async(req,res) => {
  try{
    const{
      id_master,
      is_active
    } = req.body

    await knex('users_master').where({id_master: id_master}).update({
      is_active: is_active
    })
  }catch(err){

  }
})

router.post('/isactivelogout', async(req,res) => {
  try{
    const{
      id_master,
      is_active
    } = req.body

    await knex('users_master').where({id_master: id_master}).update({
      is_active: is_active
    })
  }catch(err){

  }
})







  module.exports = router;