import mysql from "mysql2";

// 데이터베이스 연결
const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'car_project',
    password: '12201923',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

// async / await 사용
const promisePool = pool.promise();

//트랜잭션
export const transcation = {
  start: async () => {
    const sql = `start transaction`;
    await promisePool.query(sql);
  } ,
  commit: async () => {
    const sql = `commit`;
    await promisePool.query(sql);
  },
  rollback: async () => {
    const sql = `rollback`;
    await promisePool.query(sql);
},
};

// select query
export const selectSql = {
  getCustomer: async () => {
    const [rows] = await promisePool.query(`select * from customer;`);

    return rows
  },
  getAdmin: async () => {
    const [rows] = await promisePool.query(`select * from salesperson`);

    return rows
  },
  getAdminSID: async (admin) => {
    const sql = `select * from salesperson where id= ${admin}; `;
    const [result] = await promisePool.query(sql);
    return result
  },
  adminOK: async (admin) => {
    const sql = `select EXISTS (select id from salesperson where id = "${admin}") as success; `;
    const [result] = await promisePool.query(sql);
    return result
  },
  custOK: async (cust) => {
    const sql = `select EXISTS (select id from salesperson where id = "${cust}") as success; `;
    const [result] = await promisePool.query(sql);
    return result
  },
  getcustSID : async (cust) => {
    const sql = `select * from customer where id= ${cust}; `;
    const [result] = await promisePool.query(sql);
    return result
  },
  
  getshowVehicle : async (vin) => {
    const sql = `select * from vehicle where vin = ${vin}; `;
    const [result] = await promisePool.query(sql);
    return result
  },
  getVin : async(sid) => {
    const sql = `select max(vin) as vin from vehicle where salesperson_sid = ${sid}`
    const [result] = await promisePool.query(sql);
    return result;
  }, 
  getyear : async(vin) => {
    const sql = `select year(date) as year from vehicle where vin = ${vin}`
    const [result] = await promisePool.query(sql);

    return result;
  },
  getmonth : async(vin) => {
    const sql = `select month(date) as month from vehicle where vin = ${vin}`
    const [result] = await promisePool.query(sql);

    return result;
  },
  getday : async(vin) => {
    const sql = `select day(date) as day from vehicle where vin = ${vin}`
    const [result] = await promisePool.query(sql);

    return result;
  },

  select_reservation : async (sid) =>{
    const [rows] = await promisePool.query(`select * from vehicle where status = "예약중" and salesperson_sid = ${sid}`);
    return rows;
  },
  
  getReservationResult : async (vin) =>{
    const [rows] = await promisePool.query(`select * from vehicle where vin = ${vin}`);
    return rows;
  },
  getCar_new: async (data) =>{
    const [rows] = await promisePool.query(`select * from car_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" 
    and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage = 0 `);
    return rows;
  },

  getCar_old: async (data) =>{
    const [rows] = await promisePool.query(`select * from car_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage > 0 `);
    return rows;
  },

  // getCar_all: async (data) =>{
  //   const [rows] = await promisePool.query(`select v.vin as vin , r.t_id as t_id, v.salesperson_sid as salesperson,
  //    v.model as model, c.engine_size as v_option, v.status as status, v.fuel as fuel, v.mileage as mileage,
  //     v.price as price, v.year as year, v.date as date, v.customer_ssn as customer_ssn from car as c, relation as r, 
  //     vehicle as v where c.id=r.car_id and r.vehicle_vin=v.vin and r.t_id = "${data.v_type}" and fuel="${data.fuel}" 
  //     and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and 
  //     v.status = "예약가능"`);
  //   return rows;
  // },

  getCar_all: async (data) =>{
    const [rows] = await promisePool.query(`select * from car_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" 
    and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} `);
    return rows;
  },

  getSuv_new: async (data) =>{
    const [rows] = await promisePool.query(`select * from suv_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage = 0 `);
    return rows;
  },
  getSuv_old: async (data) =>{
    
    const [rows] = await promisePool.query(`select * from suv_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage > 0 `);
    return rows;
  },
  getSuv_all: async (data) =>{
    
    const [rows] = await promisePool.query(`select * from suv_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed}  `);
    return rows;
  },
  getTr_new: async (data) =>{
    const [rows] = await promisePool.query(`select * from truck_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage = 0`);
    return rows;
  },
  getTr_old: async (data) =>{
    
    const [rows] = await promisePool.query(`select * from truck_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} and mileage > 0`);
    return rows;
  },

  getTr_all: async (data) =>{
    
    const [rows] = await promisePool.query(`select * from truck_ve_all where t_id = "${data.v_type}" and fuel="${data.fuel}" and price between ${data.price_st} and ${data.price_ed} and year between ${data.year_st} and ${data.year_ed} `);
    return rows;
  },
  count_re: async(ssn) => {
    const sql = `select count(*) as c from vehicle where customer_ssn = ${ssn}`
    const [result] = await promisePool.query(sql);

    return result;
  },
  now_status: async(vin) => {
    const sql = `select status from vehicle where vin = ${vin}`
    const [result] = await promisePool.query(sql);

    return result;
  },
  getMyCarRes: async(ssn) => {
    const [rows] = await promisePool.query(`select ssn, name, vin, model, fuel, mileage, price, year, date, salesperson_sid as saleid, status from vehicle, customer where customer_ssn = ssn and customer_ssn = ${ssn}`)

    return rows;
  },
  getMyInfo: async(ssn) => {
    const sql = `select * from customer where ssn = ${ssn}`
    const [result] = await promisePool.query(sql);

    return result;
  },
  selCarOp: async() => {
    const [rows] = await promisePool.query(`select id , engine_size as op from car`)
    return rows;
  },
  selSuvOp: async() => {
    const [rows] = await promisePool.query(`select id , num_seats as op from suv`)
    return rows;
  },
  selTrOp: async() => {
    const [rows] = await promisePool.query(`select id , tonnage as op from truck`)
    return rows;
  },

}

export const insertSql = {
  //클래스 삽입 기능
  insertCustomer: async (data) => {
      console.log(data.id, data.u_name);
      const sql = `insert into customer (id, password, name, address_city, address_country, address_road) values ("${data.id}", "${data.password}", "${data.u_name}", "${data.address_city}", "${data.address_country}", "${data.address_road}")`

      await promisePool.query(sql);
    
  },
  insertVehicle: async (data, sid) => {
    const sql = `insert into vehicle (model, fuel, mileage, price, year, salesperson_sid, status) values
     ("${data.model}", "${data.fuel}", "${data.mileage}", "${data.price}", "${data.year}", ${sid}, default) `
    await promisePool.query(sql);
  },
  insRelation: async (type_id, v_type, add_vin, OpID) => {
    const sql = `insert into relation (t_id, vehicle_vin, ${type_id}) values ( "${v_type}", ${add_vin}, ${OpID} )`
    await promisePool.query(sql);
  }
  

};

export const updateSql = {
  
  updatePrice: async (vin, price) => {
    const sql = `update vehicle set price=${price} where vin=${vin}`

    await promisePool.query(sql);
  
},
  upState_NO: async (vin) => {
    const sql = `update vehicle set status="판매실패" where vin=${vin}`

    await promisePool.query(sql);

  },
  upState_OK: async (vin) => {

    const sql = `update vehicle set status="판매완료" where vin=${vin}`

    await promisePool.query(sql);

  },

  update: async (vin, today) => {
    const sql = `update vehicle set date="${today}" where vin=${vin} `
    await promisePool.query(sql);
  },
  upssn: async (vin, ssn) => {
    const sql = `update vehicle set customer_ssn=${ssn} where vin=${vin}`

    await promisePool.query(sql);
  },
  upstatus: async (vin) => {
    const sql = `update vehicle set status="예약중" where vin=${vin}`

    await promisePool.query(sql);
  },
  CanselStatus: async (Cansel_vin) => {
    const sql = `update vehicle set status="예약가능" where vin=${Cansel_vin}`
    await promisePool.query(sql);
  },
  CanselSsn: async (Cansel_vin) => {
    const sql = `update vehicle set customer_ssn=null where vin=${Cansel_vin}`
    await promisePool.query(sql);
  },
  CanselDate: async (Cansel_vin) => {
    const sql = `update vehicle set date=null where vin=${Cansel_vin}`
    await promisePool.query(sql);
  
  },
  updateStatusCansel: async () => {
    const sql = `update vehicle set status="예약가능" where status="판매실패"`
    await promisePool.query(sql);
  
  },
  updateDateCansel: async () => {
    const sql = `update vehicle set date=null where status="판매실패"`
    await promisePool.query(sql);
  
  },
  updateSsnCansel: async () => {
    const sql = `update vehicle set customer_ssn=null where status="판매실패"`
    await promisePool.query(sql);
  
  },

};

export const deleteSql = {
  delete_rel: async (vin) => {
    const sql = `delete from relation where vehicle_vin = ${vin};`
    await promisePool.query(sql);
  },
  delete_vin: async (vin) => {
    const sql = `delete from vehicle where vin=${vin}`

    await promisePool.query(sql);
  
},


};