import React from 'react';
import { HelpCircle, Info, MessageCircle } from 'lucide-react';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/ui/BackButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      
      <div className="px-4 -mt-4">
        <BackButton 
          to="/settings" 
          className="text-primary" 
        />
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-[#244b2c] text-center mb-6">
          Como podemos ajudar?
        </h1>
        
        <div className="space-y-6">
          {/* Como funciona */}
          <div className="bg-white/30 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-[#244b2c]" />
              <h2 className="text-lg font-semibold text-[#244b2c]">Como funciona o sistema de refeições?</h2>
            </div>
            
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Confirmação de Presença</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Você deve confirmar sua presença para cada refeição (café da manhã, almoço e lanche) até às 20h do dia anterior. Isso ajuda a reduzir o desperdício e garantir que todos tenham sua refeição.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Restrições Alimentares</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Se você possui alguma restrição alimentar, informe no seu perfil. A equipe da cozinha será notificada e preparará uma refeição adequada para você.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Feedback</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Após cada refeição, você pode deixar seu feedback. Isso nos ajuda a melhorar continuamente o serviço e adaptar o cardápio às preferências dos alunos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Dúvidas Frequentes */}
          <div className="bg-white/30 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#244b2c]" />
              <h2 className="text-lg font-semibold text-[#244b2c]">Dúvidas Frequentes</h2>
            </div>
            
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Como altero minhas informações pessoais?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Vá em "Configurações" > "Dados Pessoais". Lá você pode atualizar suas informações como nome, email e foto de perfil.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Esqueci minha senha, o que faço?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Na tela de login, clique em "Esqueceu sua senha?". Você receberá um email com instruções para redefinir sua senha.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Como reporto um problema?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Entre em contato conosco através do email de suporte disponível na seção "Contato". Descreva o problema em detalhes para que possamos ajudar melhor.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 