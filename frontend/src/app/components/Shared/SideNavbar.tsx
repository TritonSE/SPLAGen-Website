import Image from 'next/image';

import logo from  '../../../../public/images/Logo_SPLAGen1.png'

import styles from './SideNavbar.module.css'
const SideNavbar: React.FC = () => {
  return (
    <section className={styles.SideNavbar}>
      <div className='inline-flex items-center space-x-1 whitespace-nowrap mb-12'>
        <Image src={logo} alt='' aria-hidden='true' id={styles.logo}/>
        <strong> SPLAGen </strong>
      </div>
      
      {/* Will be visible only during regular activity */}
      <div>
        <span> Overview </span>
        <ul>
          <li>
            list items
          </li>
        </ul>
      </div>  

      {/* Will be visible only during onboarding */}
      <div>
        Onboarding progress steps, etc...
      </div>
    </section>
  )
}

export default SideNavbar