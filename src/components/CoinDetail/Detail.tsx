import { CoinMarketContext } from '@/context/cryptoCtx'
import { cn, currencyFormat, numbersFormat } from '@/lib/utils'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import Image from 'next/image'
import { FC, useContext } from 'react'

interface DetailProps {

}

const styles = {
    title: `text-gray-400 font-medium whitespace-nowrap mr-2`,
}


const Detail: FC<DetailProps> = ({ }) => {

    const { detailCoin } = useContext(CoinMarketContext)


    const currentPrice = detailCoin?.market_data.current_price.usd
    const volume = detailCoin?.market_data.total_volume.usd
    const priceChange24h = detailCoin?.market_data.price_change_percentage_24h
    const marketCap = detailCoin?.market_data.market_cap.usd
    const fullMarketCap = detailCoin?.market_data.fully_diluted_valuation.usd
    const CSSupply = detailCoin?.market_data.circulating_supply
    const ath = detailCoin?.market_data.ath.usd
    const priceChange1y = detailCoin?.market_data.price_change_percentage_1y



    return (
        <main className='flex flex-row items-center p-4 text-zinc-300'>
            <div className='flex w-3/5'>

                <section className='flex flex-col lg:flex-row'>
                    {/* Left Column - Coin Details */}
                    <article className='flex flex-col'>
                        {/* Coin Header */}
                        <header className='flex flex-col sm:flex-row justify-between'>
                            {/* Logo and Name */}
                            <figure className='flex items-center'>
                                {detailCoin?.image.large && (
                                    <Image
                                        src={detailCoin.image.large}
                                        height={55}
                                        width={55}
                                        alt={`${detailCoin.name} logo`}
                                        className='mr-4'
                                    />
                                )}
                                <figcaption>
                                    <h1 className='flex gap-2'>
                                        <span className='text-3xl'>{detailCoin?.name}</span>
                                        <span className='bg-slate-800 text-zinc-300 px-3 rounded-xl'>{detailCoin?.symbol}</span>
                                    </h1>
                                </figcaption>
                            </figure>

                            {/* Price Section */}
                            <section className='pl-5 pt-5 sm:pl-0 sm:pt-0'>
                                <p className='text-zinc-400 font-medium pb-1'>
                                    {detailCoin?.name} ({detailCoin?.symbol.toLocaleUpperCase()})
                                </p>
                                <div className='flex items-start'>
                                    <span className='text-zinc-200 text-4xl'>{currencyFormat(currentPrice)}</span>
                                    <span className={cn('flex items-center px-3 py-1.5 ml-3 rounded-xl text-zinc-200', {
                                        'bg-green-600': priceChange24h > 0,
                                        'bg-red-600': priceChange24h < 0,
                                    })}>
                                        {priceChange24h > 0 ? (
                                            <ArrowBigUp className='h-4 w-4' />
                                        ) : priceChange24h === 0 ? (
                                            null
                                        ) : (
                                            <ArrowBigDown className='h-4 w-4' />
                                        )}
                                        <small className='pl-1'>{priceChange24h.toFixed(3)}%</small>
                                    </span>
                                </div>
                            </section>
                        </header>

                        {/* Statistics Grid */}
                        <section className='flex flex-col gap-4 p-4 mt-[4rem] border-y border-gray-700'>
                            {/* Stats Container */}
                            <div className='flex flex-wrap gap-4'>
                                {/* Column 1 */}
                                <div className='flex-1 min-w-[200px] space-y-4'>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Market Cap</small>
                                        <p><small>{currencyFormat(marketCap)}</small></p>
                                    </div>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Fully Diluted Market Cap</small>
                                        <p><small>{currencyFormat(fullMarketCap)}</small></p>
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className='flex-1 min-w-[200px] space-y-4'>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Price change 24h</small>
                                        <p>
                                            <small className={cn({
                                                'text-red-600': priceChange24h < 0,
                                                'text-green-600': priceChange24h > 0,
                                            })}>
                                                {priceChange24h.toFixed(2)}%
                                            </small>
                                        </p>
                                    </div>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Price change 1y</small>
                                        <p>
                                            <small className={cn({
                                                'text-red-600': priceChange1y < 0,
                                                'text-green-600': priceChange1y > 0,
                                            })}>
                                                {priceChange1y.toFixed(2)}%
                                            </small>
                                        </p>
                                    </div>
                                </div>

                                {/* Column 3 */}
                                <div className='flex-1 min-w-[200px] space-y-4'>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>All time high</small>
                                        <p><small>{currencyFormat(ath)}</small></p>
                                    </div>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Volume</small>
                                        <p><small>{currencyFormat(volume)}</small></p>
                                    </div>
                                </div>

                                {/* Column 4 */}
                                <div className='flex-1 min-w-[200px] space-y-4'>
                                    <div className='px-2 py-1 rounded-md bg-slate-700'>
                                        <small className={styles.title}>Circulating Supply</small>
                                        <p>
                                            <small>
                                                {numbersFormat(CSSupply)} {detailCoin?.symbol.toLocaleUpperCase()}
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>
                </section>
                {/* Fear & Greed Index */}
            </div>
            <aside className='flex justify-center w-2/5 mt-5 lg:mt-0 lg:mx-0'>
                <Image
                    src="https://alternative.me/crypto/fear-and-greed-index.png"
                    alt="Latest Crypto Fear & Greed Index"
                    width={300}
                    height={300}
                    className='rounded-xl'
                />
            </aside>
        </main>
    );

}

export default Detail
