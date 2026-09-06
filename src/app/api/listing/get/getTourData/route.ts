export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { OpenAI } from 'openai';
import extractLanguageFromRequest from './extractLanguageFromRequest';
// (getUserData and authOptions are not used here, but we can keep imports if needed)

// Initialize OpenAI (if you still need it)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    // ----- 1. Get Supabase client (SSR pattern) -----
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // ----- 2. Extract params -----
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const languageCode = extractLanguageFromRequest(request);

    if (!id || id === 'undefined') {
      console.log('Invalid tour ID:', id);
      return NextResponse.json(
        { message: 'Tour ID is required and must be valid' },
        { status: 400 }
      );
    }

    // ----- 3. Get reviews count -----
    const { count: reviewsCount, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('tourId', id);

    if (countError) throw new Error(countError.message);

    // ----- 4. Get reviews with user data -----
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users (
          accountData,
          profileImage
        )
      `)
      .eq('tourId', id)
      .order('createdAt', { ascending: false })
      .limit(10);

    if (reviewsError) throw new Error(reviewsError.message);

    // ----- 5. Get the tour itself -----
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (tourError) {
      console.log('Tour not found for ID:', id);
      return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
    }

    // ----- 6. Find translation for requested language -----
    const currentLang = tour.translations?.find(
      ({ language }) => language === languageCode
    );

    // ----- 7. Process days with city data -----
    let processedDays = currentLang?.days || [];
    let continentInfo = null;

    if (Array.isArray(processedDays) && processedDays.length > 0) {
      const cityIds = processedDays
        .filter((day) => day.cityId && day.cityId !== 'undefined')
        .map((day) => day.cityId);

      if (cityIds.length > 0) {
        try {
          // Fetch city, country, state, continent from Supabase
          const { data: cities, error: citiesError } = await supabase
            .from('city')
            .select(`
              id,
              geo,
              image,
              code3,
              type,
              translations,
              country:countries (
                id,
                code,
                code3,
                geo,
                translations,
                continent:continents (
                  id,
                  translations
                )
              ),
              state:states (
                id,
                translations
              )
            `)
            .in('id', cityIds);

          if (citiesError) throw new Error(citiesError.message);

          // Filter translations to requested language
          const citiesWithLang = cities.map((city) => ({
            ...city,
            translations: city.translations?.filter((t) => t.language === languageCode) || [],
            country: city.country
              ? {
                  ...city.country,
                  translations: city.country.translations?.filter((t) => t.language === languageCode) || [],
                  continent: city.country.continent
                    ? {
                        ...city.country.continent,
                        translations: city.country.continent.translations?.filter(
                          (t) => t.language === languageCode
                        ) || [],
                      }
                    : null,
                }
              : null,
            state: city.state
              ? {
                  ...city.state,
                  translations: city.state.translations?.filter((t) => t.language === languageCode) || [],
                }
              : null,
          }));

          // Update each day with location data
          processedDays = processedDays.map((day) => {
            const cityData = citiesWithLang.find(({ id }) => id === day.cityId);
            const locationObject = createLocationObject(cityData, languageCode);
            return {
              ...day,
              ...locationObject,
            };
          });
        } catch (cityError) {
          console.error('Error fetching city data:', cityError);
        }
      }
    }

    // ----- 8. Format reviews with translations -----
    const translatedReviews = reviews.map((review) => {
      const translation = review.translations?.find(({ language }) => language === languageCode);
      return {
        ...review,
        ...translation,
        language: languageCode,
      };
    });

    // ----- 9. Build final tour data -----
    const tourData = {
      ...tour,
      translatedReviews,
      formattedReviews: reviews,   // or map further as needed
      language: languageCode,
      reviewsCount,
      continentInfo,
      ...currentLang,
      days: processedDays,
    };

    console.log('cities::::::::::::::::::::::::', tourData.days);

    return NextResponse.json(tourData);
  } catch (error) {
    console.error('Error fetching tour data:', error);
    return NextResponse.json(
      {
        message: 'Error fetching tour data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper: build location object from city data
function createLocationObject(city, language) {
  const cityEnUs = city?.translations?.find((t) => t.language === language);
  const countryEnUs = city?.country?.translations?.find((t) => t.language === language);
  const continentEnUs = city?.country?.continent?.translations?.find((t) => t.language === language);
  const stateEnUs = city?.state?.translations?.find((t) => t.language === language);

  return {
    state: stateEnUs?.name || '',
    city: cityEnUs?.name || '',
    country: countryEnUs?.name || '',
    continent: continentEnUs?.name || '',
  };
}