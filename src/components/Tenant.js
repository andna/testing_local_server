import React, { useEffect, useState } from 'react';


export default function Tenant({tenant}) {
    const formatDate = new Date(tenant.leaseEndDate).toLocaleDateString("en-US");

    return <tr>
        <th>{tenant.id}</th>
        <td>{tenant.name}</td>
        <td>{tenant.paymentStatus}</td>
        <td>{formatDate}</td>
        <td>
            <button className="btn btn-danger">Delete</button>
        </td>
    </tr>
}
