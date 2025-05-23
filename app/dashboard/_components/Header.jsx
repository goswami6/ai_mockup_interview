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
            <Link href={"/dashboard/questions"}>
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path === '/dashboard/questions' && 'text-primary font-bold'}`}
  >
    Questions
  </li>
</Link>
<Link href="/dashboard/quiz">
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path === '/dashboard/quiz' && 'text-primary font-bold'}`}
  >
    Quiz
  </li>
</Link>
            {/* <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/company'&&'text-primary font-bold'}`}>Companies</li> */}
            <Link href="/dashboard/review">
  <li
    className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
      ${path === '/dashboard/review' && 'text-primary font-bold'}`}
  >
    Review
  </li>
</Link>
        </ul>
        <UserButton/>
      
    </div>
  )
}

export default Header
