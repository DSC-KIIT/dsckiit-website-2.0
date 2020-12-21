import Member from "../components/member-template/members";
import { getMembersData } from "../lib/members";
import ReadyToTalk from "../components/ReadyToTalk/ReadyToTalk";
import TeamIntro from "../components/Intro/Intro";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../components/member-template/members.module.css";
let order = -1;
let displayHeader = false;
const siteTitle = "DSC Team";
export default function Team({
  allMembersData,
}: {
  allMembersData: {
    id: string;
    name: string;
    position: string;
    image_path: string;
    twitter: string;
    github: string;
    linkedIn: string;
    order: number;
  }[];
}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="DSC Team" />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
      </Head>
      <img
        src="https://i.imgur.com/tzzAJeX.png"
        style={{ position: "fixed", opacity: 0.1 }}
      />

      <Navbar />
      <TeamIntro />
      <section>
        <div className={styles.container}>
          {allMembersData.map(({ ...member }) => {
            if (member.order > order) {
              order++;
              displayHeader = true;
            } else {
              displayHeader = false;
            }
            // console.log(displayHeader)
            return <Member memberInfo={member} displayHeader={displayHeader} />;
          })}
        </div>
      </section>
      <ReadyToTalk />
      <Footer />
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const allMembersData = getMembersData();
  return {
    props: {
      allMembersData,
    },
  };
};