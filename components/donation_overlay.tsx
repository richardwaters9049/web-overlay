import { section } from 'framer-motion/client'
import React from 'react'

const donation_overlay = () => {
    return (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-linear-to-tr from-red-700 to-gray-900 p-8 rounded-md flex flex-col gap-8 text-xl">
                <div className="chatheader flex flex-row justify-evenly">
                    <p className='font-mono'>£50.00</p>
                    <h1 className="font-monos">Crypt_K3yper</h1>
                </div>
                <p className='font-mono'>Hey, Great Stream!! 👍🏻</p>
            </div>
        </section>
    )
}

export default donation_overlay