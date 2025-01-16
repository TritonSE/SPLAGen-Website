
import Image from "next/image";
import Link from "next/link";

import style from "./NavCard.module.css";

type CardProps = {
  icon: string,
  message: string,
  navigateTo: string,
}

const NavCard = ({icon, message, navigateTo}: CardProps) => {
 return (
  <Link href={navigateTo} className={style.card}>
    <Image src={`/icons/${icon}`} alt='' width={24} height={24}/>
    {message}
  </Link>
 ) 
}

export default NavCard;