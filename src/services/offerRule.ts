import { ScrapedAd } from '../scrapers/adLibraryPage';
import { hasDirectResponseTerms, countDirectResponseTerms, extractDirectResponseTerms } from './directResponseTerms';

export function calcDaysAgo(dateString: string | null): number | undefined {
  if (!dateString) {
    return undefined;
  }

  try {
    // Tentar parsear diferentes formatos de data
    let date: Date | null = null;

    // Formato brasileiro: "15 de janeiro de 2024"
    const brMatch = dateString.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (brMatch) {
      const months: { [key: string]: number } = {
        janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
        julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
      };
      const month = months[brMatch[2].toLowerCase()];
      if (month !== undefined) {
        date = new Date(parseInt(brMatch[3]), month, parseInt(brMatch[1]));
      }
    }

    // Formato inglês: "January 15, 2024"
    if (!date) {
      const enMatch = dateString.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/i);
      if (enMatch) {
        const months: { [key: string]: number } = {
          january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
          july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
        };
        const month = months[enMatch[1].toLowerCase()];
        if (month !== undefined) {
          date = new Date(parseInt(enMatch[3]), month, parseInt(enMatch[2]));
        }
      }
    }

    // Formato ISO ou padrão: "2024-01-15"
    if (!date) {
      date = new Date(dateString);
    }

    if (!date || isNaN(date.getTime())) {
      return undefined;
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return daysAgo;
  } catch (error) {
    console.error(`Erro ao calcular daysAgo para "${dateString}":`, error);
    return undefined;
  }
}

export function enrichAdsWithAge(
  ads: ScrapedAd[]
): (ScrapedAd & { startedRunningDaysAgo?: number })[] {
  return ads.map((ad) => {
    const daysAgo = calcDaysAgo(ad.startedRunningOn);
    return {
      ...ad,
      startedRunningDaysAgo: daysAgo,
    };
  });
}

export function evaluatePageOfferRule(
  adsWithAge: (ScrapedAd & { startedRunningDaysAgo?: number })[]
): {
  totalActiveAds: number;
  hasAdOlderThan7Days: boolean;
  hasOfferByRule: boolean;
  hasDrTerms: boolean;
  drTermsCount: number;
} {
  const totalActiveAds = adsWithAge.length;
  const hasAdOlderThan7Days = adsWithAge.some(
    (ad) => ad.startedRunningDaysAgo !== undefined && ad.startedRunningDaysAgo >= 7
  );
  
  // Verificar termos de venda direta
  const adsWithDrTerms = adsWithAge.filter(ad => {
    const fullText = [ad.text, ad.headline, ad.cta].filter(Boolean).join(' ');
    return hasDirectResponseTerms(fullText);
  });
  
  const hasDrTerms = adsWithDrTerms.length > 0;
  const drTermsCount = adsWithDrTerms.length;
  
  // Regra: >= 10 anúncios E >= 1 anúncio com 7+ dias E pelo menos 1 com termos DR
  const hasOfferByRule = totalActiveAds >= 10 && hasAdOlderThan7Days && hasDrTerms;

  return {
    totalActiveAds,
    hasAdOlderThan7Days,
    hasOfferByRule,
    hasDrTerms,
    drTermsCount,
  };
}

