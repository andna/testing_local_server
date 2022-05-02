import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import Tenant from './components/Tenant'
import Adder from './components/Adder'

function App() {

  const getTenants = async () => {
    try {
      const response = await Service.getTenants();
      setIsLoading(false);
      setTenants(response);
    } catch(err) {
      setHasNetworkError(true);
    }
  }

  const onDeleteTenant = async (id) => {
    setIsLoading(true);
    try {
      const response = await Service.deleteTenant(id);
      getTenants();
    } catch(err) {
      setIsLoading(false);
      setHasNetworkError(true);
      console.error(err)
    }
  }

  useEffect(()=> {
    getTenants()
  }, [])

  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  return (
      <>
        {hasNetworkError && <div className="dialog-container">
          <div className="dialog">

            <p>It seems your network is having troubles.</p>
            {tenants.length === 0 ?
                <>
                  <p>Please wait a few seconds and refresh this page.</p>

                  <button className="btn btn-primary"
                          onClick={()=>{ window.location.reload() }}
                  >Refresh</button>
                </>
                :
                <>
                  <p>Please wait a few seconds and try again.</p>

                  <button className="btn btn-primary"
                          onClick={()=>{ setHasNetworkError(false) }}
                  >Ok</button>
                </>

            }
          </div>
        </div>}
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
              <>{tenants.map(tenant => (
                  <Tenant key={tenant.name}
                          tenant={tenant}
                          handleDeleteTenant={onDeleteTenant}
                  />
              ))}</>
              {isLoading &&
              <tr>
                <td colSpan={5} style={{textAlign:'center'}}>
                  Loading...
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
        <div className="container" >
          <button className={`btn ${isAdding ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => {setIsAdding(!isAdding)}}>
            Add Tenant
            <span className="button-icon">
              {isAdding ? 'x' : '+'}
            </span>
          </button>
        </div>
        {isAdding && <Adder/>}

      </>
  );
}

export default App;
