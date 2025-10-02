import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";





export default function Home() {

const router=useRouter();

  return ( 
    <UserLayout>
   <div className={styles.container}>
    <div className={styles.mainContainer}>

      <div className={styles.mainContainer_left}>
        <p>connect with friends and some randams without exaggration</p>
        <p>a true social media plateform , with stories with no bufs</p>

        <div onClick={()=>{
          router.push("/login")
        }} className={styles.buttonJoin}>
          <p>join now</p>
        </div>
      </div>


      <div className={styles.mainContainer_right}>
        <img src="images/connection2.jpg" alt="" />
      </div>

    </div>
     </div>
    </ UserLayout>
   );
}




