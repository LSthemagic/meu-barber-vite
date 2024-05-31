import React, { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { useAuth as useAuthBarbershop } from '../../Barbershop/context/BarberContext';
import { useAuth as useAuthClient } from '../../Client/context/AuthContext';

const LandingPage = () => {
  const { pathname } = useLocation()
  const isBarberRoutes = pathname.startsWith("/barber")
  const { isLogged: isLoggedBarber } = useAuthBarbershop()
  const { isLogged } = useAuthClient()
  const navigate = useNavigate()
  const isLoggedForRoute = (isBarberRoutes && isLoggedBarber) || (!isBarberRoutes && isLogged);



  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {!isLoggedForRoute && (
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <header className="bg-gray-800 shadow w-full py-6 mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-center text-white">MEU Barber</h1>
            </div>
          </header>
          <main className="flex-1 w-full text-center px-4 sm:px-6 lg:px-8">
            <section className="hero mb-12">
              <div className="relative overflow-hidden bg-gray-700 text-white py-12">
                <h2 className="text-4xl font-bold mb-4">Bem-vindo ao MEU Barber!</h2>
                <p className="text-lg mb-6">
                  Encontre e agende com suas barbearias favoritas, ou, se você for um barbeiro, ofereça seus serviços e gerencie seu negócio.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to={isLogged ? "/home" : "/authenticate"}

                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sou Cliente
                  </Link>
                  <Link
                    to={isLoggedBarber ? "/barber/homeBarber" : "/barber/registerBarber"}
                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Sou Barbearia
                  </Link>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-2xl font-bold text-white mb-8">Nossas Funcionalidades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <h4 className="text-xl font-semibold text-white mb-2">Para Clientes</h4>
                    <ul className="list-disc list-inside text-left text-gray-300">
                      <li>Agendamento fácil e rápido</li>
                      <li>Favoritar suas barbearias preferidas</li>
                      <li>Encontrar barbearias próximas</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <h4 className="text-xl font-semibold text-white mb-2">Para Barbearias</h4>
                    <ul className="list-disc list-inside text-left text-gray-300">
                      <li>Gerenciar serviços e horários</li>
                      <li>Adicionar e gerenciar barbeiros</li>
                      <li>Oferecer promoções e descontos</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <h4 className="text-xl font-semibold text-white mb-2">Experiência Completa</h4>
                    <ul className="list-disc list-inside text-left text-gray-300">
                      <li>Interface amigável e intuitiva</li>
                      <li>Suporte ao cliente dedicado</li>
                      <li>Atualizações constantes e melhorias</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-2xl font-bold text-white mb-8">Galeria de Imagens</h3>
                <Slider {...settings}>
                  <div>
                    <img src="https://cdn.leonardo.ai/users/4faac9a5-cda4-49fa-923b-a6a4c5d22b79/generations/5f147520-3744-46fb-a03a-6a23c09c9dc0/Default_generates_a_cinematic_image_of_a_black_man_getting_his_0.jpg?w=512" alt="Galeria 1" className="w-full h-64 object-cover rounded-lg" />
                  </div>
                  <div>
                    <img src="https://cdn.leonardo.ai/users/4faac9a5-cda4-49fa-923b-a6a4c5d22b79/generations/a889915d-5375-4065-ac22-4f0f91448f5f/Default_generate_a_cinematic_image_of_a_black_man_getting_his_2.jpg?w=512" alt="Galeria 2" className="w-full h-64 object-cover rounded-lg" />
                  </div>
                  <div>
                    <img src="https://cdn.leonardo.ai/users/4faac9a5-cda4-49fa-923b-a6a4c5d22b79/generations/a889915d-5375-4065-ac22-4f0f91448f5f/Default_generate_a_cinematic_image_of_a_black_man_getting_his_3.jpg?w=512" alt="Galeria 3" className="w-full h-64 object-cover rounded-lg" />
                  </div>
                </Slider>
              </div>
            </section>

            <section className="bg-gray-800 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-2xl font-bold text-white mb-8">Depoimentos</h3>
                <Slider {...settings}>
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <p className="text-lg italic text-white">"Excelente serviço! Encontrei a barbearia perfeita perto de casa."</p>
                    <p className="mt-4 text-gray-400">- João Silva</p>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <p className="text-lg italic text-white">"Ótima plataforma para gerenciar minha barbearia."</p>
                    <p className="mt-4 text-gray-400">- Carlos Santos</p>
                  </div>
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-700">
                    <p className="text-lg italic text-white">"Recomendo a todos os meus amigos!"</p>
                    <p className="mt-4 text-gray-400">- Maria Oliveira</p>
                  </div>
                </Slider>
              </div>
            </section>
          </main>
          <footer className="bg-gray-800 shadow w-full py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-400 text-sm">
                &copy; 2024 MEU Barber. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </div>)}
    </div>
  );
};

export default LandingPage;
