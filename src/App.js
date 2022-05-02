import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import Tenant from './components/Tenant'
import Adder from './components/Adder'

function App() {


  const tabs = [
    {id: 'all', label: 'All'},
    {id: 'late', label: 'Payment is late'},
    {id: 'inAMonth', label: 'Lease ends in less than a month'}
  ]

  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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
      if(response === 'OK'){
        getTenants();
      }
    } catch(err) {
      setIsLoading(false);
      setHasNetworkError(true);
      console.error(err)
    }
  }

  useEffect(()=> {
    getTenants()
  }, [])

  useEffect(()=> {
    if(tenants && tenants.length > 0){
      setFilteredTenants(tenants)
    }
  }, [tenants])

  useEffect(()=> {
    if(activeTab){
      //setFilteredTenants(tenants)
    }
  }, [activeTab])



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
            {tabs.map(tab => <li className="nav-item" key={tab.id}>
              <a
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  href="#">
                {tab.label}
              </a>
            </li>)}
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
              <>{filteredTenants.map(tenant => (
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
