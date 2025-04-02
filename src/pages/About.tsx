import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import Logo from '../components/Logo';
import { Info, Users, Heart, School, Mail, Github } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <StatusBar />
      
      <div className="p-4 border-b border-gray-100">
        <BackButton to="/settings" label="Sobre o Aplicativo" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Logo size="lg" />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Vamos Merendar</h2>
          <p className="text-muted-foreground text-center">Versão 1.0.0</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6 overflow-hidden max-w-md mx-auto">
          <div className="p-4 bg-muted border-b border-border flex items-center">
            <Info className="text-primary mr-2" size={18} />
            <h3 className="font-medium text-foreground">Sobre o Projeto</h3>
          </div>
          
          <div className="p-4">
            <p className="text-foreground mb-4">
              O "Vamos Merendar" é um aplicativo desenvolvido para facilitar a gestão da alimentação escolar, conectando alunos, nutricionistas e professores em uma plataforma integrada.
            </p>
            
            <p className="text-foreground mb-2">
              Nossa missão é melhorar a experiência da alimentação escolar através de:
            </p>
            
            <ul className="list-disc pl-5 mb-4 text-foreground space-y-1">
              <li>Cardápios acessíveis e transparentes</li>
              <li>Acompanhamento de restrições alimentares</li>
              <li>Feedback sobre as refeições</li>
              <li>Redução do desperdício de alimentos</li>
            </ul>
            
            <p className="text-foreground">
              Desenvolvido como projeto acadêmico no Instituto Federal de Educação, Ciência e Tecnologia do Ceará - Campus Maranguape.
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6 overflow-hidden max-w-md mx-auto">
          <div className="p-4 bg-muted border-b border-border flex items-center">
            <Users className="text-primary mr-2" size={18} />
            <h3 className="font-medium text-foreground">Equipe</h3>
          </div>
          
          <div className="p-4">
            <div className="mb-3">
              <h4 className="font-medium text-foreground">Desenvolvimento</h4>
              <p className="text-primary">Equipe de Desenvolvimento IFCE</p>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-foreground">Design</h4>
              <p className="text-primary">Equipe de Design IFCE</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Supervisão</h4>
              <p className="text-primary">Profa. Jessyca Bessa</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden max-w-md mx-auto mb-6">
          <div className="p-4 bg-muted border-b border-border flex items-center">
            <Mail className="text-primary mr-2" size={18} />
            <h3 className="font-medium text-foreground">Contato</h3>
          </div>
          
          <div className="p-4">
            <p className="text-foreground mb-3">
              Para sugestões, dúvidas ou suporte:
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail size={16} className="text-primary mr-2" />
                <a href="mailto:vamosmerendar@example.com" className="text-foreground hover:text-muted-foreground hover:underline">
                  vamosmerendar@example.com
                </a>
              </div>
              
              <div className="flex items-center">
                <Github size={16} className="text-primary mr-2" />
                <a href="https://github.com/vamosmerendar" className="text-foreground hover:text-muted-foreground hover:underline" target="_blank" rel="noopener noreferrer">
                  github.com/vamosmerendar
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground max-w-md mx-auto">
          <p className="flex items-center justify-center">
            Feito com <Heart size={14} className="text-primary mx-1" /> em Fortaleza, Ceará.
          </p>
          <p className="mt-1">© 2025 Vamos Merendar. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
