import Image from 'next/image';

export const LaptopMockup = () => (
    <>
        <div className="relative mx-auto rounded-t-xl border-5 border-solid rounded-es-[10px] rounded-ee-[10px] w-fit">
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 w-fit">
                <Image
                    src="/showLanding.png"
                    className="block w-full rounded-lg"
                    alt="Dark Mode Mockup"
                    width={900}
                    height={500}
                />
            </div>
        </div>

        {/* <div className='border border-solid border-white'>
        <Image
            src="/showLanding.png"
            className="block rounded-lg"
            alt="Dark Mode Mockup"
            width={700}
            height={400}
        />
        </div> */}
    </>
);

export default LaptopMockup;
