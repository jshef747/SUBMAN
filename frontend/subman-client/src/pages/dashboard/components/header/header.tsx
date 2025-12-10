import './header.css';

const Header: React.FC = () => {
    return (
        <div className='header-container'>
            <h1 className='header-title'>SUBMAN</h1>

            <button className='add-btn'>Add New Subscription</button>
        </div>
    )
}

export default Header;