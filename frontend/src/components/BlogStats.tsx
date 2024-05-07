interface Stats {    
    likes: string[],
    total_comments: number,
    total_likes: number,
    total_parent_comments: number,
    total_reads: number
}

// Define a type for the keys you expect
type StatsKey = keyof Stats;

const BlogStats = ({
    stats 
} : {
    stats: Stats
}) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
        {
            (Object.keys(stats)  as StatsKey[])
            .filter(key => !key.includes("parent") && key !== "likes")
            .map((key, i) => (
                <div className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${i != 0 ? 'border-grey border-l' : ''}`} key={i}>
                    <h1 className="text-xl lg:text-2xl mb-2">{stats[key].toLocaleString()}</h1>
                    <p className="max-lg:text-dark-grey capitalize">{key.split("_")[1]}</p>
                </div>
            ))
        }
    </div>
  )
}

export default BlogStats