import Image from 'next/image';

import logo from  '../../../public/images/Logo_SPLAGen1.png'

import NavCard from './NavCard';
import styles from './SideNavbar.module.css'
import logout from './NavCard.module.css'

type CardProps = {
  icon: string;
  navigateTo: string;
  message: string;
};

const counselorItems: CardProps[] = [
  {
    icon: 'dashboard_dark.svg',
    navigateTo: '/dashboard',
    message: 'Dashboard',
  },
  {
    icon: 'discussion_dark.svg',
    navigateTo: '/discussion',
    message: 'Discussion',
  },
  {
    icon: 'announcements_dark.svg',
    navigateTo: '/announcements',
    message: 'Announcements',
  },
  {
    icon: 'counselors_dark.svg',
    navigateTo: '/counselors',
    message: 'Counselors',
  },
  {
    icon: 'admins_dark.svg',
    navigateTo: '/admins',
    message: 'Admins',
  },
];

const SideNavbar: React.FC = () => {

  return (
    <section className={styles.SideNavbar}>
      <div className={styles.decoration}>
        <Image src={logo} alt='' aria-hidden='true' id={styles.logo}/>
        <strong> SPLAGen </strong>
      </div>

      <div className={styles.cards}>
        <span className='text-gray-500'> OVERVIEW </span>

        {counselorItems.map((item, index) => (
          <NavCard
            key={index}
            icon={item.icon}
            navigateTo={item.navigateTo}
            message={item.message}
          />
        ))}
      </div>
      <br/>

      <button className={logout.card} id={styles.logout}>
        <Image src = '/icons/logout_dark.svg' alt='Logout' width={24} height={24}/>
        Log out
      </button>
    </section>
  )
}

export default SideNavbar