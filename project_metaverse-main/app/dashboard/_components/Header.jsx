"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Header = () => {
    const path = usePathname();
    useEffect(()=>{
        console.log(path)
    },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm px-10'>
        <Image  src={'/logo.svg'} width={150} height={150} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
        <Link href={"/dashboard"}>
            <li className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path=='/dashboard'&&'text-primary font-bold'}
            `}
            
            >Dashboard</li>
            </Link>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/questions'&&'text-primary font-bold'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/quies'&&'text-primary font-bold'}`}>Quies</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/company'&&'text-primary font-bold'}`}>Companies</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/how'&&'text-primary font-bold'}`}>How it works?</li>
        </ul>
        <UserButton/>
      
    </div>
  )
}

export default Header
