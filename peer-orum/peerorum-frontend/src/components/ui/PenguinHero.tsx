import penguinHero from '../../assets/images/penguin-hero.png'

export default function PenguinHero({ className = 'h-28 w-28' }: { className?: string }) {
  return (
    <img
      src={penguinHero}
      alt="피어오름 펭귄 캐릭터"
      width={1254}
      height={1254}
      className={`inline-block object-contain ${className}`}
    />
  )
}
