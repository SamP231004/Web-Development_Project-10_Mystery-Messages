'use client';

import '@/app/CSS/laptop.css'
import Image from 'next/image';
import logo from '@/app/Images_Used/logo.png'
import image1 from '@/app/Images_Used/Image_1.png'
import portfolio from '@/app/Images_Used/portfolio.png'
import linkedin from '@/app/Images_Used/linkedin.png'
import github from '@/app/Images_Used/github.png';
import rightArrow from '@/app/Images_Used/right_arrow.png'

export default function Home() {
    return (
        <>
            <div className="header">
                <div className="logo">
                    <Image src={logo} alt=''></Image>
                </div>
                <div className="tabs">
                    <a href="/dashboard">Dashboard</a>
                </div>
            </div>
            <div className="container">
                <div className="title">
                    <p>Mystery</p>
                    <p>Messages</p>
                </div>
                <div className="maskedImage">
                    <Image src={image1} alt=''></Image>
                </div>
                <div className="bottomPart">
                    <div className="tagline">
                        Unmask the Message, Not the Messenger.
                        <Image src={rightArrow} alt=''></Image>
                    </div>
                    <div className="startExperience">
                        <a href="/dashboard">
                            Start Experience
                        </a>
                        <Image src={rightArrow} alt=''></Image>
                    </div>
                    <div className='contact'>
                        <a href="https://samp231004.github.io/Portfolio/" target='_blank'><Image src={portfolio} alt='' /></a>
                        <a href="https://www.linkedin.com/in/samp2310/" target='_blank'><Image src={linkedin} alt='' /></a>
                        <a href="https://github.com/SamP231004" target='_blank'><Image src={github} alt='' /></a>
                    </div>
                </div>
            </div>
        </>
    );
}
