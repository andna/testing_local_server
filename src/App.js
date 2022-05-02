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



  const headers = [
    {id: 'id', label: '#'},
    {id: 'name', label: 'Name'},
    {id: 'paymentStatus', label: 'Payment Status'},
    {id: 'leaseEndDate', label: 'Lease End Date'},
    {id: 'actions', label: 'Actions'},
  ]


  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [activeSort, setActiveSort] = useState(headers[0].id);

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
    filerAndSortTenants()
  }, [activeTab, activeSort])

  const filerAndSortTenants = () => {
    if(activeTab && activeSort){
      let newFilteredTenants = [];
      switch (activeTab){
        case tabs[0].id:
          newFilteredTenants = tenants;
          break;
        case tabs[1].id:
          newFilteredTenants = tenants.filter(tenant => tenant.paymentStatus === 'LATE');
          break;
        case tabs[2].id:
          newFilteredTenants = tenants.filter(tenant => {
            const today = new Date();
            const oneMonthAgo = today.setMonth(today.getMonth() - 1);
            const tenantLease = new Date(tenant.leaseEndDate);
            return tenantLease > oneMonthAgo
          });
          break;
      }
      switch (activeSort){

        case headers[0].id:
          newFilteredTenants = newFilteredTenants.sort(function(a, b) {
            return a.id - b.id;
          })
          break;
        case headers[1].id:
          newFilteredTenants = newFilteredTenants.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          })
          break;
        case headers[2].id:
          newFilteredTenants = newFilteredTenants.sort(function(a, b) {
            return a.paymentStatus.localeCompare(b.paymentStatus);
          })
          break;
        case headers[3].id:
          newFilteredTenants = newFilteredTenants.sort(function(a, b) {
            return new Date(a.leaseEndDate).getTime() - new Date(b.leaseEndDate).getTime();
          })
          break;
      }
      console.log('should be ordering by:',activeSort, newFilteredTenants)
      setFilteredTenants(newFilteredTenants)
    }
  }


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
                {headers.map(header => <th
                    className={`header-link ${activeSort === header.id ? 'active' : ''}`}
                                           onClick={() => setActiveSort(header.id)}
                                           key={header.id}>
                  {header.label}
                </th>)}
              </tr>
            </thead>
            <tbody>
              <>{
                filteredTenants && filteredTenants.length > 0
                  ?
                    <>
                      { filteredTenants.map(tenant => (
                          <Tenant key={tenant.name}
                                  tenant={tenant}
                                  handleDeleteTenant={onDeleteTenant}
                          />
                      ))}
                    </>
                    :
                    <>
                      {!isLoading &&
                        <tr>
                        <td colSpan={5} style={{textAlign:'center'}}>
                        Couldn't find tenants.
                        </td>
                        </tr>

                      }
                  </>


               }</>
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
