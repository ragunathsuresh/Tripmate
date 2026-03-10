const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');

dotenv.config();

const getImg = (id) => `https://images.unsplash.com/photo-${id}?w=1000&auto=format&fit=crop&q=80`;

const destinations = [
    // --- BEACH (5) ---
    {
        name: 'Maldives', country: 'Maldives', city: 'Malé', category: 'Beach', climate: 'Tropical', travelStyle: 'Couple',
        description: 'Pristine beaches and overwater villas in a tropical paradise.',
        rating: 4.9, estimatedBudget: 5000, estimatedCostPerDay: 700, bestTimeToVisit: 'November to April',
        images: [getImg('1514282401047-d79a71a590e8')],
        coordinates: { lat: 3.2028, lng: 73.2207 },
        activities: [{ title: 'Snorkeling', description: 'Explore coral reefs.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 15000
    },
    {
        name: 'Bora Bora', country: 'French Polynesia', city: 'Bora Bora', category: 'Beach', climate: 'Tropical', travelStyle: 'Couple',
        description: 'Crystal clear lagoons and luxury resorts.',
        rating: 4.8, estimatedBudget: 4500, estimatedCostPerDay: 800, bestTimeToVisit: 'May to October',
        images: [getImg('1532408840957-031d8030ae75')],
        coordinates: { lat: -16.5004, lng: -151.7415 },
        activities: [{ title: 'Jet Skiing', description: 'Fun in the lagoon.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 12000
    },
    {
        name: 'Maui', country: 'USA', city: 'Hawaii', category: 'Beach', climate: 'Tropical', travelStyle: 'Family',
        description: 'Stunning beaches, lush landscapes, and volcano views.',
        rating: 4.7, estimatedBudget: 4000, estimatedCostPerDay: 500, bestTimeToVisit: 'April to September',
        images: [getImg('1505852673315-4e34f6bbd68a')],
        coordinates: { lat: 20.7984, lng: -156.3319 },
        activities: [{ title: 'Surfing', description: 'World-class waves.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 22000
    },
    {
        name: 'Phuket', country: 'Thailand', city: 'Phuket', category: 'Beach', climate: 'Tropical', travelStyle: 'Solo',
        description: 'Vibrant nightlife and beautiful island scenery.',
        rating: 4.5, estimatedBudget: 1200, estimatedCostPerDay: 120, bestTimeToVisit: 'December to March',
        images: [getImg('1589308078059-be1415eab4c3')],
        coordinates: { lat: 7.8804, lng: 98.3923 },
        activities: [{ title: 'Island Hopping', description: 'Visit Phi Phi islands.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 45000
    },
    {
        name: 'Amalfi Coast', country: 'Italy', city: 'Amalfi', category: 'Beach', climate: 'Coastal', travelStyle: 'Couple',
        description: 'Picturesque coastal towns and Mediterranean charm.',
        rating: 4.8, estimatedBudget: 3500, estimatedCostPerDay: 600, bestTimeToVisit: 'May to September',
        images: [getImg('1533903345306-15d1c30952de')],
        coordinates: { lat: 40.6333, lng: 14.6027 },
        activities: [{ title: 'Coastal Walk', description: 'Path of the Gods.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 28000
    },

    // --- HILL (5) ---
    {
        name: 'Leh', country: 'India', city: 'Ladakh', category: 'Hill', climate: 'Alpine', travelStyle: 'Solo',
        description: 'High-altitude desert mountains and ancient monasteries.',
        rating: 4.8, estimatedBudget: 800, estimatedCostPerDay: 80, bestTimeToVisit: 'June to September',
        images: [getImg('1596492784531-1588663806a6')],
        coordinates: { lat: 34.1526, lng: 77.5771 },
        activities: [{ title: 'Pangong Lake', description: 'Highest salt lake.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 10000
    },
    {
        name: 'Shimla', country: 'India', city: 'Himachal', category: 'Hill', climate: 'Moderate', travelStyle: 'Family',
        description: 'Queen of Hills, famous for colonial architecture.',
        rating: 4.4, estimatedBudget: 600, estimatedCostPerDay: 70, bestTimeToVisit: 'March to June',
        images: [getImg('1597079910443-60c43ca51b25')],
        coordinates: { lat: 31.1048, lng: 77.1734 },
        activities: [{ title: 'Toy Train Ride', description: 'Scenic mountain railway.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 35000
    },
    {
        name: 'Manali', country: 'India', city: 'Himachal', category: 'Hill', climate: 'Cold', travelStyle: 'Adventure',
        description: 'Valley of the Gods, a hub for adventure sports.',
        rating: 4.6, estimatedBudget: 700, estimatedCostPerDay: 90, bestTimeToVisit: 'October to February',
        images: [getImg('1626344331046-2aa61be79b7b')],
        coordinates: { lat: 32.2432, lng: 77.1892 },
        activities: [{ title: 'Paragliding', description: 'Fly over Solang Valley.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 40000
    },
    {
        name: 'Munnar', country: 'India', city: 'Kerala', category: 'Hill', climate: 'Moderate', travelStyle: 'Couple',
        description: 'Rolling hills covered in emerald green tea plantations.',
        rating: 4.7, estimatedBudget: 900, estimatedCostPerDay: 100, bestTimeToVisit: 'September to March',
        images: [getImg('1516641320493-2780e557297e')],
        coordinates: { lat: 10.0889, lng: 77.0595 },
        activities: [{ title: 'Tea Garden Tour', description: 'Learn about tea processing.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 30000
    },
    {
        name: 'Mount Cook', country: 'New Zealand', city: 'Canterbury', category: 'Hill', climate: 'Alpine', travelStyle: 'Solo',
        description: 'The highest mountain in New Zealand.',
        rating: 4.9, estimatedBudget: 3000, estimatedCostPerDay: 350, bestTimeToVisit: 'December to February',
        images: [getImg('1507699622108-4be3abd695ad')],
        coordinates: { lat: -43.7333, lng: 170.1 },
        activities: [{ title: 'Hooker Valley Track', description: 'Walk towards the peaks.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 15000
    },

    // --- HISTORICAL (5) ---
    {
        name: 'Rome', country: 'Italy', city: 'Lazio', category: 'Historical', climate: 'Moderate', travelStyle: 'Family',
        description: 'The Eternal City with gladiatorial ruins and Renaissance art.',
        rating: 4.8, estimatedBudget: 3200, estimatedCostPerDay: 400, bestTimeToVisit: 'April to June',
        images: [getImg('1552832230-c0197dd311b5')],
        coordinates: { lat: 41.9028, lng: 12.4964 },
        activities: [{ title: 'Colosseum Tour', description: 'Ancient Roman history.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 65000
    },
    {
        name: 'Cairo', country: 'Egypt', city: 'Giza', category: 'Historical', climate: 'Arid', travelStyle: 'Solo',
        description: 'Home to the Great Pyramids and the Sphinx.',
        rating: 4.6, estimatedBudget: 1500, estimatedCostPerDay: 150, bestTimeToVisit: 'October to April',
        images: [getImg('1503177119275-0aa32b3a9368')],
        coordinates: { lat: 30.0444, lng: 31.2357 },
        activities: [{ title: 'Pyramid Visit', description: 'Wonder of the ancient world.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 40000
    },
    {
        name: 'Machu Picchu', country: 'Peru', city: 'Cusco', category: 'Historical', climate: 'Alpine', travelStyle: 'Adventure',
        description: 'Lost city of the Incas set high in the Andes.',
        rating: 4.9, estimatedBudget: 2800, estimatedCostPerDay: 300, bestTimeToVisit: 'May to September',
        images: [getImg('1526392060635-9d6019884377')],
        coordinates: { lat: -13.1631, lng: -72.5450 },
        activities: [{ title: 'Inca Trail', description: 'Historic trek through mountains.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 20000
    },
    {
        name: 'Athens', country: 'Greece', city: 'Attica', category: 'Historical', climate: 'Moderate', travelStyle: 'Solo',
        description: 'Cradle of Western civilization and ancient Agora.',
        rating: 4.7, estimatedBudget: 2200, estimatedCostPerDay: 250, bestTimeToVisit: 'April to June',
        images: [getImg('1503152394-c571994fd383')],
        coordinates: { lat: 37.9838, lng: 23.7275 },
        activities: [{ title: 'Acropolis Visit', description: 'The Parthenon temple.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 38000
    },
    {
        name: 'Petra', country: 'Jordan', city: 'Ma\'an', category: 'Historical', climate: 'Arid', travelStyle: 'Solo',
        description: 'The Rose City, carved directly into vibrant red cliffs.',
        rating: 4.9, estimatedBudget: 1800, estimatedCostPerDay: 200, bestTimeToVisit: 'March to May',
        images: [getImg('1579606091094-7edb4013000b')],
        coordinates: { lat: 30.3285, lng: 35.4444 },
        activities: [{ title: 'Al-Khazneh', description: 'The Treasury of Petra.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 15000
    },

    // --- ADVENTURE (5) ---
    {
        name: 'Interlaken', country: 'Switzerland', city: 'Bernese Oberland', category: 'Adventure', climate: 'Alpine', travelStyle: 'Solo',
        description: 'The paragliding and skydiving capital of Europe.',
        rating: 4.8, estimatedBudget: 4500, estimatedCostPerDay: 500, bestTimeToVisit: 'June to August',
        images: [getImg('1531310197839-ccf54634509e')],
        coordinates: { lat: 46.6863, lng: 7.8632 },
        activities: [{ title: 'Canyoning', description: 'Jump through waterfalls.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 12000
    },
    {
        name: 'Rishikesh', country: 'India', city: 'Uttarakhand', category: 'Adventure', climate: 'Moderate', travelStyle: 'Solo',
        description: 'World capital of yoga and river rafting hub.',
        rating: 4.7, estimatedBudget: 500, estimatedCostPerDay: 60, bestTimeToVisit: 'September to November',
        images: [getImg('1590050752117-23a9d7fc20c3')],
        coordinates: { lat: 30.0869, lng: 78.2676 },
        activities: [{ title: 'River Rafting', description: 'Tame the Ganges rapids.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 45000
    },
    {
        name: 'Moab', country: 'USA', city: 'Utah', category: 'Adventure', climate: 'Arid', travelStyle: 'Solo',
        description: 'Gateway to Arches and Canyonlands National Parks.',
        rating: 4.8, estimatedBudget: 2200, estimatedCostPerDay: 250, bestTimeToVisit: 'April to May',
        images: [getImg('1505438819080-60566e9275a5')],
        coordinates: { lat: 38.5733, lng: -109.5498 },
        activities: [{ title: 'Rock Climbing', description: 'Challenge the red rocks.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 18000
    },
    {
        name: 'Queenstown', country: 'New Zealand', city: 'Otago', category: 'Adventure', climate: 'Moderate', travelStyle: 'Solo',
        description: 'The birthplace of commercial bungy jumping.',
        rating: 4.9, estimatedBudget: 4000, estimatedCostPerDay: 500, bestTimeToVisit: 'December to February',
        images: [getImg('1507699622108-4be3abd695ad')],
        coordinates: { lat: -45.0312, lng: 168.6626 },
        activities: [{ title: 'Bungy Jump', description: 'Ultimate adrenaline rush.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 30000
    },
    {
        name: 'Whistler', country: 'Canada', city: 'British Columbia', category: 'Adventure', climate: 'Cold', travelStyle: 'Solo',
        description: 'World-renowned ski resort and mountain bike park.',
        rating: 4.7, estimatedBudget: 3500, estimatedCostPerDay: 400, bestTimeToVisit: 'December to March',
        images: [getImg('1517411032315-54ef2cb783bb')],
        coordinates: { lat: 50.1163, lng: -122.9574 },
        activities: [{ title: 'Downhill Biking', description: 'Fast mountain tracks.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 25000
    },

    // --- CITY (5) ---
    {
        name: 'New York', country: 'USA', city: 'Manhattan', category: 'City', climate: 'Moderate', travelStyle: 'Family',
        description: 'The city that never sleeps, known for Broadway and skylines.',
        rating: 4.8, estimatedBudget: 4500, estimatedCostPerDay: 500, bestTimeToVisit: 'September to November',
        images: [getImg('1496442226666-8d4d0e62e6e9')],
        coordinates: { lat: 40.7128, lng: -74.0060 },
        activities: [{ title: 'Times Square', description: 'Heart of the theater district.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 75000
    },
    {
        name: 'Tokyo', country: 'Japan', city: 'Shibuya', category: 'City', climate: 'Moderate', travelStyle: 'Solo',
        description: 'Vibrant neon city with incredible food and culture.',
        rating: 4.9, estimatedBudget: 3800, estimatedCostPerDay: 400, bestTimeToVisit: 'October to November',
        images: [getImg('1540959733332-eab4deabeeaf')],
        coordinates: { lat: 35.6762, lng: 139.6503 },
        activities: [{ title: 'Shibuya Crossing', description: 'World\'s busiest intersection.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 85000
    },
    {
        name: 'Paris', country: 'France', city: 'Ile-de-France', category: 'City', climate: 'Moderate', travelStyle: 'Couple',
        description: 'City of light, fashion, and unparalleled art collections.',
        rating: 4.8, estimatedBudget: 3500, estimatedCostPerDay: 450, bestTimeToVisit: 'May to June',
        images: [getImg('1502602898657-3e91760cbb34')],
        coordinates: { lat: 48.8566, lng: 2.3522 },
        activities: [{ title: 'Louvre Museum', description: 'See the Mona Lisa.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 90000
    },
    {
        name: 'London', country: 'UK', city: 'Greater London', category: 'City', climate: 'Rainy', travelStyle: 'Family',
        description: 'Historic city with modern vibes and royal traditions.',
        rating: 4.7, estimatedBudget: 4200, estimatedCostPerDay: 480, bestTimeToVisit: 'June to August',
        images: [getImg('1513635269975-59663e0ac1ad')],
        coordinates: { lat: 51.5074, lng: -0.1278 },
        activities: [{ title: 'London Eye', description: 'Panoramic city views.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 80000
    },
    {
        name: 'Singapore', country: 'Singapore', city: 'Marina Bay', category: 'City', climate: 'Tropical', travelStyle: 'Business',
        description: 'Futuristic city state with gardens and shopping.',
        rating: 4.8, estimatedBudget: 3000, estimatedCostPerDay: 350, bestTimeToVisit: 'February to April',
        images: [getImg('1525625232244-31da64790a3b')],
        coordinates: { lat: 1.3521, lng: 103.8198 },
        activities: [{ title: 'Gardens by the Bay', description: 'Supertree Grove.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 45000
    },

    // --- WILDLIFE (5) ---
    {
        name: 'Galapagos', country: 'Ecuador', city: 'Santa Cruz', category: 'Wildlife', climate: 'Coastal', travelStyle: 'Solo',
        description: 'Unique species and pristine volcanic landscapes.',
        rating: 4.9, estimatedBudget: 5500, estimatedCostPerDay: 600, bestTimeToVisit: 'December to May',
        images: [getImg('1548625345-d8687009477b')],
        coordinates: { lat: -0.8293, lng: -90.9656 },
        activities: [{ title: 'Tortoise Watching', description: 'Giant Galapagos tortoises.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 5000
    },
    {
        name: 'Kruger NP', country: 'South Africa', city: 'Mpumalanga', category: 'Wildlife', climate: 'Moderate', travelStyle: 'Family',
        description: 'One of the largest game reserves in Africa.',
        rating: 4.8, estimatedBudget: 3200, estimatedCostPerDay: 350, bestTimeToVisit: 'May to September',
        images: [getImg('1516426122078-c23e76319801')],
        coordinates: { lat: -23.988, lng: 31.5547 },
        activities: [{ title: 'Safari', description: 'Big five game drive.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 12000
    },
    {
        name: 'Amazon Rainforest', country: 'Brazil', city: 'Manaus', category: 'Wildlife', climate: 'Rainy', travelStyle: 'Solo',
        description: 'The worlds largest rainforest, home to incredible diversity.',
        rating: 4.7, estimatedBudget: 2800, estimatedCostPerDay: 300, bestTimeToVisit: 'July to December',
        images: [getImg('1516908205727-40afad9449a8')],
        coordinates: { lat: -3.4653, lng: -62.2159 },
        activities: [{ title: 'River Cruise', description: 'Explore the Amazon river.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 10000
    },
    {
        name: 'Serengeti', country: 'Tanzania', city: 'Arusha', category: 'Wildlife', climate: 'Arid', travelStyle: 'Couple',
        description: 'Famous for the Great Migration and vast plains.',
        rating: 4.9, estimatedBudget: 4500, estimatedCostPerDay: 500, bestTimeToVisit: 'June to October',
        images: [getImg('1516426122078-c23e76319801')],
        coordinates: { lat: -2.3333, lng: 34.8333 },
        activities: [{ title: 'Balloon Safari', description: 'View the wild from above.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 15000
    },
    {
        name: 'Pantanal', country: 'Brazil', city: 'Cuiabá', category: 'Wildlife', climate: 'Rainy', travelStyle: 'Family',
        description: 'The worlds largest tropical wetland area.',
        rating: 4.6, estimatedBudget: 2200, estimatedCostPerDay: 250, bestTimeToVisit: 'May to September',
        images: [getImg('1516908205727-40afad9449a8')],
        coordinates: { lat: -18.0, lng: -56.0 },
        activities: [{ title: 'Jaguar Tracking', description: 'Spot the elusive cat.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 7000
    },

    // --- WELLNESS (5) ---
    {
        name: 'Ubud', country: 'Indonesia', city: 'Bali', category: 'Wellness', climate: 'Tropical', travelStyle: 'Solo',
        description: 'Spiritual center known for yoga and meditation.',
        rating: 4.9, estimatedBudget: 1500, estimatedCostPerDay: 150, bestTimeToVisit: 'May to September',
        images: [getImg('1537996194471-e657df975ab4')],
        coordinates: { lat: -8.5069, lng: 115.2625 },
        activities: [{ title: 'Yoga Class', description: 'Connect with your soul.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 30000
    },
    {
        name: 'Kerala', country: 'India', city: 'Kochi', category: 'Wellness', climate: 'Tropical', travelStyle: 'Family',
        description: 'Gods Own Country, famous for Ayurveda.',
        rating: 4.8, estimatedBudget: 1200, estimatedCostPerDay: 120, bestTimeToVisit: 'September to March',
        images: [getImg('1602216056096-3b40cc0c9944')],
        coordinates: { lat: 9.9312, lng: 76.2673 },
        activities: [{ title: 'Ayurveda Massage', description: 'Traditional healing.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 25000
    },
    {
        name: 'Blue Lagoon', country: 'Iceland', city: 'Reykjavik', category: 'Wellness', climate: 'Arctic', travelStyle: 'Couple',
        description: 'Geothermal spa in a volcanic landscape.',
        rating: 4.7, estimatedBudget: 4000, estimatedCostPerDay: 450, bestTimeToVisit: 'June to August',
        images: [getImg('1520763185298-1b434c919102')],
        coordinates: { lat: 63.8792, lng: -22.4451 },
        activities: [{ title: 'Spa Day', description: 'Soak in mineral waters.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 20000
    },
    {
        name: 'Sedona', country: 'USA', city: 'Arizona', category: 'Wellness', climate: 'Arid', travelStyle: 'Solo',
        description: 'Famed for its red rock buttes and energy vortexes.',
        rating: 4.6, estimatedBudget: 2500, estimatedCostPerDay: 300, bestTimeToVisit: 'March to May',
        images: [getImg('1469022563428-aa04fef94ca4')],
        coordinates: { lat: 34.8697, lng: -111.7610 },
        activities: [{ title: 'Meditation', description: 'Find peace in the desert.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 18000
    },
    {
        name: 'Tulum', country: 'Mexico', city: 'Quintana Roo', category: 'Wellness', climate: 'Tropical', travelStyle: 'Couple',
        description: 'Eco-chic wellness retreat on the Caribbean coast.',
        rating: 4.7, estimatedBudget: 3200, estimatedCostPerDay: 400, bestTimeToVisit: 'November to December',
        images: [getImg('1518730518541-d0843268c287')],
        coordinates: { lat: 20.2114, lng: -87.4654 },
        activities: [{ title: 'Beach Yoga', description: 'Sunrise yoga sessions.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 22000
    },

    // --- LUXURY (5) ---
    {
        name: 'Monte Carlo', country: 'Monaco', city: 'Monte Carlo', category: 'Luxury', climate: 'Coastal', travelStyle: 'Business',
        description: 'Glamorous lifestyle, casinos, and luxury yachts.',
        rating: 4.9, estimatedBudget: 8000, estimatedCostPerDay: 1200, bestTimeToVisit: 'May to September',
        images: [getImg('1559586111-9a7064d7c071')],
        coordinates: { lat: 43.7384, lng: 7.4246 },
        activities: [{ title: 'Casino Night', description: 'The famous Monte Carlo Casino.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 15000
    },
    {
        name: 'Santorini', country: 'Greece', city: 'Oia', category: 'Luxury', climate: 'Coastal', travelStyle: 'Couple',
        description: 'World-famous sunsets and luxury cave hotels.',
        rating: 4.9, estimatedBudget: 4500, estimatedCostPerDay: 550, bestTimeToVisit: 'May to October',
        images: [getImg('1570077188670-e3a8d69ac5ff')],
        coordinates: { lat: 36.4618, lng: 25.3753 },
        activities: [{ title: 'Sunset Cruise', description: 'Private boat tour.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 40000
    },
    {
        name: 'Dubai Marina', country: 'UAE', city: 'Dubai', category: 'Luxury', climate: 'Arid', travelStyle: 'Business',
        description: 'The pinnacle of modern man-made luxury.',
        rating: 4.7, estimatedBudget: 6000, estimatedCostPerDay: 800, bestTimeToVisit: 'November to March',
        images: [getImg('1512453979798-5ea266f8880c')],
        coordinates: { lat: 25.2048, lng: 55.2708 },
        activities: [{ title: 'Shopping Spree', description: 'Visit the Dubai Mall.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 60000
    },
    {
        name: 'St. Moritz', country: 'Switzerland', city: 'Engadin', category: 'Luxury', climate: 'Cold', travelStyle: 'Solo',
        description: 'Exclusive ski resort with high-end boutiques.',
        rating: 4.8, estimatedBudget: 7500, estimatedCostPerDay: 1000, bestTimeToVisit: 'December to March',
        images: [getImg('1548680674-394747dbdf08')],
        coordinates: { lat: 46.4981, lng: 9.8392 },
        activities: [{ title: 'Designer Shopping', description: 'Via Serlas boutiques.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 12000
    },
    {
        name: 'Capri', country: 'Italy', city: 'Naples', category: 'Luxury', climate: 'Coastal', travelStyle: 'Couple',
        description: 'Island of glitz, famous for its Blue Grotto.',
        rating: 4.9, estimatedBudget: 5000, estimatedCostPerDay: 650, bestTimeToVisit: 'June to August',
        images: [getImg('1533903345306-15d1c30952de')],
        coordinates: { lat: 40.5522, lng: 14.2427 },
        activities: [{ title: 'Boat Tour', description: 'Visit the Blue Grotto.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 25000
    },

    // --- CULTURAL (5) ---
    {
        name: 'Kyoto Cultural', country: 'Japan', city: 'Kyoto', category: 'Cultural', climate: 'Moderate', travelStyle: 'Solo',
        description: 'The cultural heart of Japan with thousands of temples.',
        rating: 4.9, estimatedBudget: 3500, estimatedCostPerDay: 400, bestTimeToVisit: 'April or November',
        images: [getImg('1493976040374-85c8e12f0c0e')],
        coordinates: { lat: 35.0116, lng: 135.7681 },
        activities: [{ title: 'Temple Tour', description: 'Visit Kinkaku-ji.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 50000
    },
    {
        name: 'Varanasi', country: 'India', city: 'Uttar Pradesh', category: 'Cultural', climate: 'Humid', travelStyle: 'Solo',
        description: 'One of the oldest continuously inhabited cities.',
        rating: 4.6, estimatedBudget: 800, estimatedCostPerDay: 80, bestTimeToVisit: 'November to February',
        images: [getImg('1561361513-2d000a50f0dc')],
        coordinates: { lat: 25.3176, lng: 82.9739 },
        activities: [{ title: 'Ganga Aarti', description: 'Spiritual river ceremony.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 40000
    },
    {
        name: 'Florence', country: 'Italy', city: 'Tuscany', category: 'Cultural', climate: 'Moderate', travelStyle: 'Couple',
        description: 'The birthplace of the Renaissance.',
        rating: 4.9, estimatedBudget: 3800, estimatedCostPerDay: 450, bestTimeToVisit: 'May to September',
        images: [getImg('1541370976299-4d24ebbc9077')],
        coordinates: { lat: 43.7695, lng: 11.2558 },
        activities: [{ title: 'Uffizi Gallery', description: 'World-class art museum.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 55000
    },
    {
        name: 'Oaxaca', country: 'Mexico', city: 'Oaxaca de Juárez', category: 'Cultural', climate: 'Moderate', travelStyle: 'Family',
        description: 'Deeply rooted in indigenous traditions and food.',
        rating: 4.7, estimatedBudget: 1800, estimatedCostPerDay: 200, bestTimeToVisit: 'October to March',
        images: [getImg('1518730518541-d0843268c287')],
        coordinates: { lat: 17.0732, lng: -96.7266 },
        activities: [{ title: 'Mezcal Tasting', description: 'Sample the local spirit.', type: 'food' }],
        status: 'active', visitorsPerMonth: 20000
    },
    {
        name: 'Siem Reap', country: 'Cambodia', city: 'Siem Reap', category: 'Cultural', climate: 'Tropical', travelStyle: 'Solo',
        description: 'Gateway to the magnificent Angkor Wat temple complex.',
        rating: 4.9, estimatedBudget: 1200, estimatedCostPerDay: 130, bestTimeToVisit: 'November to March',
        images: [getImg('1500048993953-d23a436266cf')],
        coordinates: { lat: 13.3633, lng: 103.8567 },
        activities: [{ title: 'Angkor Wat Sunrise', description: 'Breathtaking temple views.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 45000
    },

    // --- ROAD TRIP (5) ---
    {
        name: 'Great Ocean Road', country: 'Australia', city: 'Victoria', category: 'RoadTrip', climate: 'Coastal', travelStyle: 'Family',
        description: 'One of the worlds most scenic coastal drives.',
        rating: 4.8, estimatedBudget: 2500, estimatedCostPerDay: 300, bestTimeToVisit: 'December to February',
        images: [getImg('1506973035872-a4ec16b8e8d9')],
        coordinates: { lat: -38.68, lng: 143.07 },
        activities: [{ title: 'Twelve Apostles', description: 'Iconic limestone stacks.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 25000
    },
    {
        name: 'Route 66', country: 'USA', city: 'Midwest to West', category: 'RoadTrip', climate: 'Arid', travelStyle: 'Solo',
        description: 'The Mother Road, an iconic American journey.',
        rating: 4.7, estimatedBudget: 4000, estimatedCostPerDay: 350, bestTimeToVisit: 'May to September',
        images: [getImg('1533106497176-45ae19e68ba2')],
        coordinates: { lat: 35.1983, lng: -111.6513 },
        activities: [{ title: 'Diner Lunch', description: 'Classic Americana.', type: 'food' }],
        status: 'active', visitorsPerMonth: 30000
    },
    {
        name: 'Garden Route', country: 'South Africa', city: 'Western Cape', category: 'RoadTrip', climate: 'Coastal', travelStyle: 'Couple',
        description: 'Stunning coastline, forests and lagoons.',
        rating: 4.8, estimatedBudget: 2800, estimatedCostPerDay: 280, bestTimeToVisit: 'November to March',
        images: [getImg('1549488344-1f9b8d2bd1f3')],
        coordinates: { lat: -34.03, lng: 23.04 },
        activities: [{ title: 'Knysna Heads', description: 'Dramatic sea views.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 20000
    },
    {
        name: 'Wild Atlantic Way', country: 'Ireland', city: 'West Coast', category: 'RoadTrip', climate: 'Moderate', travelStyle: 'Solo',
        description: 'Rugged beauty along the Atlantic coastline.',
        rating: 4.9, estimatedBudget: 3200, estimatedCostPerDay: 350, bestTimeToVisit: 'June to August',
        images: [getImg('1506692234032-45e54d856001')],
        coordinates: { lat: 53.0, lng: -9.0 },
        activities: [{ title: 'Cliffs of Moher', description: 'Breathtaking heights.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 18000
    },
    {
        name: 'Pacific Coast Hwy', country: 'USA', city: 'California', category: 'RoadTrip', climate: 'Coastal', travelStyle: 'Couple',
        description: 'Dramatic cliffs and ocean views along Highway 1.',
        rating: 4.8, estimatedBudget: 3500, estimatedCostPerDay: 400, bestTimeToVisit: 'April to October',
        images: [getImg('1449034446853-66c86144b0ad')],
        coordinates: { lat: 36.37, lng: -121.9 },
        activities: [{ title: 'Big Sur Drive', description: 'Incredible vistas.', type: 'nature' }],
        status: 'active', visitorsPerMonth: 40000
    },
    // --- BUDGET VARIETY (5) ---
    {
        name: 'Pokhara', country: 'Nepal', city: 'Pokhara', category: 'Hill', climate: 'Moderate', travelStyle: 'Solo',
        description: 'Gateway to the Annapurna Circuit with stunning lake views.',
        rating: 4.8, estimatedBudget: 400, estimatedCostPerDay: 45, bestTimeToVisit: 'October to December',
        images: [getImg('1544085311-11a028465b03')],
        coordinates: { lat: 28.2096, lng: 83.9856 },
        activities: [{ title: 'Paragliding', description: 'Fly over Phewa Lake.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 15000
    },
    {
        name: 'Berlin Central', country: 'Germany', city: 'Berlin', category: 'City', climate: 'Moderate', travelStyle: 'Solo',
        description: 'Vibrant history and electronic music capital of the world.',
        rating: 4.6, estimatedBudget: 600, estimatedCostPerDay: 65, bestTimeToVisit: 'May to September',
        images: [getImg('1560969184-10fe8719e047')],
        coordinates: { lat: 52.52, lng: 13.405 },
        activities: [{ title: 'Wall Tour', description: 'Explore Berlin Wall sites.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 50000
    },
    {
        name: 'Goa Beaches', country: 'India', city: 'North Goa', category: 'Beach', climate: 'Tropical', travelStyle: 'Solo',
        description: 'Famous for its party vibes and sunset sessions.',
        rating: 4.5, estimatedBudget: 500, estimatedCostPerDay: 55, bestTimeToVisit: 'November to February',
        images: [getImg('1512343879784-a960bf40e7f2')],
        coordinates: { lat: 15.2993, lng: 74.124 },
        activities: [{ title: 'Beach Party', description: 'Dance till dawn.', type: 'sightseeing' }],
        status: 'active', visitorsPerMonth: 60000
    },
    {
        name: 'French Riviera Villa', country: 'France', city: 'Cannes', category: 'Luxury', climate: 'Coastal', travelStyle: 'Couple',
        description: 'Ultra-exclusive private villa overlooking the Mediterranean.',
        rating: 5.0, estimatedBudget: 15000, estimatedCostPerDay: 2200, bestTimeToVisit: 'June to August',
        images: [getImg('1453747063559-51190442a08a')],
        coordinates: { lat: 43.5528, lng: 7.0174 },
        activities: [{ title: 'Private Yacht', description: 'Sail the azure waters.', type: 'adventure' }],
        status: 'active', visitorsPerMonth: 5000
    },
    {
        name: 'The Ritz-Carlton Dubai', country: 'UAE', city: 'Jumeirah', category: 'Luxury', climate: 'Arid', travelStyle: 'Business',
        description: 'Ultimate Arabian luxury on the shores of Dubai.',
        rating: 4.9, estimatedBudget: 12000, estimatedCostPerDay: 1800, bestTimeToVisit: 'December to February',
        images: [getImg('1512453979798-5ea266f8880c')],
        coordinates: { lat: 25.0657, lng: 55.127 },
        activities: [{ title: 'Sky View Dinner', description: 'Dine above the city lights.', type: 'food' }],
        status: 'active', visitorsPerMonth: 8000
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for clean seeding...');
        await Destination.deleteMany();
        await Destination.insertMany(destinations);
        console.log(`Successfully seeded ${destinations.length} destinations with high-quality images!`);
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
};

seedDB();
