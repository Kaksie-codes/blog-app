import { Link } from "react-router-dom";
import { getFullDay } from "../libs/date";

const AboutUser = ({ 
    bio, 
    social_links, 
    joinedAt ,
    classNames
} : {
    bio: string;
    social_links: {
        youtube: string;
        instagram: string;
        facebook: string;
        twitter: string;
    };
    joinedAt: string;
    classNames: string;
}) => {
    return (
        <div className={`${classNames} md:w-[90%] md:mt-7`}>
            <p>{bio.length ? bio : 'Nothing to read here'}</p>
            <div className="flex gap-x-7 gap-y-2 flex-wrap mt-3 items-center text-dark-grey">
                {
                    Object.keys(social_links).map((key, index) => {
                        let link = social_links[key as keyof typeof social_links]; // Type assertion
                        return link ? <Link to={link} key={index} target="_blank"><i className={`fi ${key != 'website' ? `fi-brands-${key}` : 'fi-sr-globe'} text-2xl hover:text-black`}></i></Link> : '';
                    })
                }
            </div>
            <p className="text-xl leading-7 text-dark-grey">Joined On {getFullDay(joinedAt)}</p>
        </div>
    );
}

export default AboutUser;
