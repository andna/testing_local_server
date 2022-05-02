import React, { useState, useEffect } from 'react';


export default function Adder({handleAdd}) {

    const [ formTouched, setFormTouched ] = useState(false);
    const [ formValid, setFormValid ] = useState(false);
    const [ name, setName ] = useState("");
    const [ nameError, setNameError ] = useState("");

    const onNameChange = (e) => {
        setName(e.target.value)
    }

    useEffect(()=> {
        let isValid = true;
        if(name){
            if(!formTouched){
                setFormTouched(true)
            }
            if(name.length >= 25){
                isValid = false;
                setNameError("Can't be longer than 25 chars.")
            } else {
                setNameError("");
            }
        } else {
            setNameError("Name required")
        }
    }, [name])

    return  <div className="container">
        <form>
            <div className="form-group">
                <label>Name</label>
                <input
                    value={name}
                    onChange={(e)=> onNameChange(e)}
                    className="form-control"/>
                {formTouched && nameError && nameError !== "" &&
                <p className="msg-error">{nameError}</p>}
            </div>
            <div className="form-group">
                <label>Payment Status</label>
                <select className="form-control">
                    <option>CURRENT</option>
                    <option>LATE</option>
                </select>
            </div>
            <div className="form-group">
                <label>Lease End Date</label>
                <input className="form-control"/>
            </div>
            <i>Adding Tenants coming soon... </i>
            <button className="btn btn-secondary" disabled>Save</button>
            <button className="btn">Cancel</button>
        </form>
    </div>
}
