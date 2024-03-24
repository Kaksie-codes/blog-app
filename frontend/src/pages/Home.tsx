import InpageNavigation from "../components/InpageNavigation"
import AnimationWrapper from "../libs/page-animation"


const Home = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex gap-10 justify-center">
        <div className="w-full">
          <InpageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
              <h1>Latest Blogs Here</h1>
              <h1>Trending Blogs Here</h1>
          </InpageNavigation>
        </div>
        <div>

        </div>
      </section>      
    </AnimationWrapper>
  )
}

export default Home