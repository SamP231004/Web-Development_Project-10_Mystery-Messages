'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthProvider';

import '@/app/CSS/laptop.css'
import Image from 'next/image';
import logo from '@/app/Images_Used/logo.png'

function Navbar() {
    const { user, signOut } = useAuth();

    return (
        <nav>
            <div className="NavContainer">
                <a href="#" className="">
                    <div className="logo">
                        <Image src={logo} alt=''></Image>
                    </div>
                    Mystery Messages
                </a>
                {user ? (
                    <>
                        <span>
                            Hey there, {user.username || user.email} 😊
                        </span>
                        <Button onClick={signOut} variant='outline'>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button variant={'outline'}>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
