import { SiNetflix, SiSpotify, SiYoutube, SiAmazonprime, SiSlack, SiAdobe, SiGithub, SiDropbox, SiGooglecloud, SiApple, SiHbo, SiTwitch } from 'react-icons/si';
import { FaQuestionCircle } from 'react-icons/fa';

export const getServiceIcon = (serviceName: string) => {
    const normalizedName = serviceName.toLowerCase().trim();

    // Map for partial matches or specific keys
    if (normalizedName.includes('netflix')) return <SiNetflix color="#E50914" />;
    if (normalizedName.includes('spotify')) return <SiSpotify color="#1DB954" />;
    if (normalizedName.includes('youtube')) return <SiYoutube color="#FF0000" />;
    if (normalizedName.includes('amazon') || normalizedName.includes('prime')) return <SiAmazonprime color="#00A8E1" />;
    if (normalizedName.includes('slack')) return <SiSlack color="#4A154B" />;
    if (normalizedName.includes('adobe')) return <SiAdobe color="#FF0000" />;
    if (normalizedName.includes('github')) return <SiGithub color="#181717" />;
    if (normalizedName.includes('dropbox')) return <SiDropbox color="#0061FF" />;
    if (normalizedName.includes('google')) return <SiGooglecloud color="#4285F4" />;
    if (normalizedName.includes('apple')) return <SiApple color="#A2AAAD" />;
    if (normalizedName.includes('hbo')) return <SiHbo color="#FFF" />; // HBO often white on dark, or black.
    if (normalizedName.includes('twitch')) return <SiTwitch color="#9146FF" />;

    // Default icon
    return <FaQuestionCircle color="#ccc" />;
};
