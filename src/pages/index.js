import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'


'use client'
import {Box, Button, Center} from '@chakra-ui/react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Box align="center" fontSize="14em" justify="center" padding="12px" >Bibliotheca</Box>
      <Box bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text" fontWeight="bold" align="center" fontSize="5em" justify="center">Your Digital Librarian</Box>
      <Link href="/signin"><Center><Button _hover={{ bg:"#f4a261" }} border='2px' padding="5px" marginTop="5em" boxShadow= '2xl'width='600px' rounded='md' size='lg' bg='white'>Sign In</Button></Center></Link>
    </div>
  )
}
