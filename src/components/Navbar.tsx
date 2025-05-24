'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

import '@/app/CSS/laptop.css'
import Image from 'next/image';
import logo from '@/app/Images_Used/logo.png'

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav>
            <div className="NavContainer">
                <a href="#" className="">
                    <div className="logo">
                        <Image src={logo} alt=''></Image>
                    </div>
                    Mystery Messages
                </a>
                {session ? (
                    <>
                        <span>
                            Hey there, {user.username || user.email} 😊
                        </span>
                        <Button onClick={() => signOut()} variant='outline'>
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