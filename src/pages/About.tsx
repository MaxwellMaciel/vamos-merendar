
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import Logo from '../components/Logo';
import { Info, Users, Heart, School, Mail, Github } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Sobre o Aplicativo" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Logo size="lg" />
          </div>
          
          <h2 className="text-xl font-semibold text-primary mb-2">Vamos Merendar</h2>
          <p className="text-gray-600 text-center">Versão 1.0.0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden max-w-md mx-auto">
          <div className="p-4 bg-primary/5 border-b border-gray-100 flex items-center">
            <Info className="text-primary mr-2" size={18} />
            <h3 className="font-medium">Sobre o Projeto</h3>
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              O "Vamos Merendar" é um aplicativo desenvolvido para facilitar a gestão da alimentação escolar, conectando alunos, nutricionistas e professores em uma plataforma integrada.
            </p>
            
            <p className="text-gray-700 mb-2">
              Nossa missão é melhorar a experiência da alimentação escolar através de:
            </p>
            
            <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1">
              <li>Cardápios acessíveis e transparentes</li>
              <li>Acompanhamento de restrições alimentares</li>
              <li>Feedback sobre as refeições</li>
              <li>Redução do desperdício de alimentos</li>
            </ul>
            
            <p className="text-gray-700">
              Desenvolvido por estudantes do ensino médio no campus IFCE Maranguape.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden max-w-md mx-auto">
          <div className="p-4 bg-primary/5 border-b border-gray-100 flex items-center">
            <Users className="text-primary mr-2" size={18} />
            <h3 className="font-medium">Equipe</h3>
          </div>
          
          <div className="p-4">
            <div className="mb-3">
              <h4 className="font-medium text-gray-800">Desenvolvimento</h4>
              <p className="text-gray-700">Estudantes do IFCE Maranguape</p>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-gray-800">Design</h4>
              <p className="text-gray-700">Equipe de Design IFCE Maranguape</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">Supervisão</h4>
              <p className="text-gray-700">Profª. Jessyca Bessa</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden max-w-md mx-auto mb-6">
          <div className="p-4 bg-primary/5 border-b border-gray-100 flex items-center">
            <Mail className="text-primary mr-2" size={18} />
            <h3 className="font-medium">Contato</h3>
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 mb-3">
              Para sugestões, dúvidas ou suporte:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail size={16} className="text-gray-500 mr-2" />
                <a href="mailto:vamosmerendar@example.com" className="text-primary hover:underline">
                  vamosmerendar@example.com
                </a>
              </div>
              
              <div className="flex items-center">
                <Github size={16} className="text-gray-500 mr-2" />
                <a href="https://github.com/vamosmerendar" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  github.com/vamosmerendar
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-500 max-w-md mx-auto">
          <p className="flex items-center justify-center">
            Feito com <Heart size={14} className="text-red-500 mx-1" /> em Maranguape, Ceará.
          </p>
          <p className="mt-1">© 2025 Vamos Merendar. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
