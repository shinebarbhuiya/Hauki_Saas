import Image from "next/image";

interface EmptyProps {
    label: string;
}


const Empty = ({label}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center">
        <div className="relative h-80 w-80 lg:h-96 lg:w-96">
            <Image 
                alt="Empty"
                fill 
                src='/empty.png'
            />
        </div>
        <div className="text-muted-foreground text-md text-center">
            {label}
        </div>
    </div>
  )
}

export default Empty