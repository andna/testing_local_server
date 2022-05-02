import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import Tenant from './components/Tenant'

function App() {

  const getTenants = async () => {
    try {
      const response = await Service.getTenants();
      setIsLoading(false);
      setTenants(response);
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(()=> {
    getTenants()
  }, [])

  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
      <>
        <div className="container">
          <h1>Tenants</h1>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" href="#">All</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Payment is late</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Lease ends in less than a month</a>
            </li>
          </ul>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Payment Status</th>
                <th>Lease End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ?
                <tr>
                  <td colSpan={5} style={{textAlign:'center'}}>
                    Loading...
                  </td>
                </tr>
              :
                <>{tenants.map(tenant => (
                    <Tenant tenant={tenant} key={tenant.name}/>
                  ))}</>
            }
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary">Add Tenant</button>
        </div>
        <div className="container">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control"/>
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
            <button className="btn btn-primary">Save</button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </>
  );
}

export default App;
