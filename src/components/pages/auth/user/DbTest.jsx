import { useState,useEffect } from "react";

function DbTest(){
    const [db,setdb]=useState(null);
    useEffect(()=>{
        fetch('http://localhost:3000/register').then(res=>res.json()).then(data=>setdb(data)).catch(err=>console.log(err));
    },[]);
    console.log(db.t)
    return<>
        <h2>{JSON.stringify(db)}</h2>
    </>
}
export default DbTest;