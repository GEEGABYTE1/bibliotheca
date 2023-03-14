import Head from 'next/head'

import { Inter } from '@next/font/google'

import Link from 'next/link'



'use client'
import {Box, Button, Center, Image, Text} from '@chakra-ui/react'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
    <Head>
        <title>Bibliotheca</title>
            
      </Head>
    
    <Box height="900px" width="auto" backgroundImage="url('/images/Wallpaper3.png')" backgroundPosition="center" backgroundSize="cover"
  backgroundRepeat="no-repeat">
    
      
      <Box align="center" justify="center" padding="12px">
        <Center>
        <Text marginTop="6%" fontSize="8em">Bibliotheca</Text>
        </Center>
      </Box>
      <Box bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text" fontWeight="bold" align="center" fontSize="5em" justify="center">Your Digital Librarian</Box>
      <Link href="/signin"><Center><Button _hover={{ bg:"#ffafcc" }} border='2px' padding="5px" marginTop="5em" boxShadow= '2xl'width='600px' rounded='md' size='lg' bg='white'> Get Started!</Button></Center></Link>
     
    
    </Box>
    </div>
  )
}
