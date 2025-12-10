import './subscriptionList.css';

const subscriptions = [
    { id: 1, service: 'Netflix', price: '$12.99', renewalDate: '2024-07-15' , status: 'Active'},
    { id: 2, service: 'Spotify', price: '$9.99', renewalDate: '2024-07-20' , status: 'Active'},
    { id: 3, service: 'Hulu', price: '$11.99', renewalDate: '2024-07-25' , status: 'Expired'},
    { id: 4, service: 'Disney+', price: '$7.99', renewalDate: '2024-07-30' , status: 'Active'},
]

const SubscriptionList: React.FC = () => {
    return (
        <div className='sub-list-card'>
            <h3 className='card-title'>Dashboard</h3>
            <table className='sub-table'>
                <thead>
                    <tr>
                        <th style={{textAlign: 'left'}}>Service</th>
                        <th>Price</th>
                        <th>Renewal Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className='table-row'>
                            <td className='service-cell'>
                                {}
                                {sub.service}
                            </td>
                            <td>{sub.price}</td>
                            <td>{sub.renewalDate}</td>
                            <td>
                                <span className={`status-badge ${sub.status.toLowerCase()}`}>
                                    {sub.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SubscriptionList;