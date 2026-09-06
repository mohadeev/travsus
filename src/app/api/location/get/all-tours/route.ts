export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import extractLanguageFromRequest from '@/app/api/listing/get/getTourData/extractLanguageFromRequest';

export async function GET(request: NextRequest) {
  try {
    console.log("=== ALL TOURS: START ===");

    const { searchParams } = request.nextUrl;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '8');

    console.log("=== ALL TOURS: PAGE/LIMIT ===", page, limit);

    const language = extractLanguageFromRequest(request);
    console.log("=== ALL TOURS: LANGUAGE ===", language);

    // ----- 1. Get Supabase client (SSR) -----
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // ----- 2. Get total count -----
    const { count: totalTours, error: countError } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true })
      .not('images', 'is', null)
      .gt('images', '[]');

    if (countError) throw new Error(countError.message);

    console.log("=== ALL TOURS: COUNT ===", totalTours);

    // ----- 3. Fetch paginated tours with address relations -----
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select(`
        id,
        slugs,
        translations,
        images,
        days,
        accommodations,
        price,
        pricingTiers,
        startAddress:Address!startAddressId (
          id,
          streetAddress,
          city,
          country,
          geoCoordinates
        ),
        endAddress:Address!endAddressId (
          id,
          streetAddress,
          city,
          country,
          geoCoordinates
        )
      `)
      .not('images', 'is', null)
      .gt('images', '[]')
      .order('createdAt', { ascending: false })
      .range(start, end);

    if (toursError) throw new Error(toursError.message);

    console.log("=== ALL TOURS: FIND MANY ===", tours?.length);

    // ----- 4. Format data -----
    const savedList: string[] = []; // placeholder for liked

    const modifiedToursData = tours.map((tour) => {
      const translation = tour.translations?.find(
        (trns) => trns.language === language
      ) || {};

      const { translations, ...rest } = tour;
      return {
        ...rest,
        ...translation,
        liked: savedList.includes(tour.id),
      };
    });

    console.log("=== ALL TOURS: MAPPING OK ===");

    return NextResponse.json({
      allToursData: modifiedToursData,
      totalTours,
      page,
      totalPages: Math.ceil(totalTours / limit),
      language,
    });
  } catch (error) {
    console.error("=== ALL TOURS REAL ERROR ===", error);
    return NextResponse.json(
      {
        message: 'Error fetching tour data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}