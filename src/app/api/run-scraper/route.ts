import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://immo-scanner-scraper-guillaumerot6122-pcw8vwdygmnc2g.leapcell-async.dev/run-scrapers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Vérifier si la réponse est en JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      return NextResponse.json(
        { 
          success: response.ok, 
          status: response.status,
          message: response.ok ? 'Scraper lancé avec succès' : 'Réponse inattendue du serveur',
          rawResponse: text
        },
        { status: response.ok ? 200 : 500 }
      );
    }

    if (!response.ok) {
      throw new Error(data.message || `Erreur: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('Erreur lors de l\'appel au scraper:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
