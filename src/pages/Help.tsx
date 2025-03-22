
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BackButton from '../components/ui/BackButton';
import { HelpCircle, ChevronDown, ChevronUp, AlignLeft, Calendar, Coffee, QrCode, User, Clock, LockKeyhole, MessagesSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white page-transition">
      <StatusBar />
      
      <div className="p-4">
        <BackButton to="/settings" label="Ajuda e Suporte" />
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <HelpCircle size={36} className="text-primary" />
          </div>
          
          <h2 className="text-xl font-semibold text-primary">Como podemos ajudar?</h2>
          <p className="text-gray-600 text-center mt-2">Encontre respostas para as dúvidas mais comuns</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <AlignLeft size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Como funciona o cardápio semanal?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  O cardápio semanal é atualizado regularmente pelo nutricionista da escola. Você pode ver o que será servido em cada refeição (café da manhã, almoço e lanche) durante toda a semana.
                </p>
                <p>
                  Para acessar o cardápio semanal, basta ir para a tela principal do aplicativo onde você verá as refeições do dia atual. Para ver os próximos dias, deslize para a esquerda ou use o seletor de datas no topo da tela.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <QrCode size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Como usar o QR Code para confirmar presença?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  Para confirmar sua presença em uma refeição, você deve utilizar o QR Code disponível no aplicativo.
                </p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Na tela principal, selecione a refeição que deseja confirmar presença.</li>
                  <li>Toque no botão "Gerar QR Code" para exibir seu código único.</li>
                  <li>Apresente este QR Code ao responsável no refeitório.</li>
                  <li>Após a leitura do código, sua presença será automaticamente registrada no sistema.</li>
                </ol>
                <p className="mt-2">
                  Lembre-se que o QR Code é pessoal e intransferível, e só pode ser usado uma vez por refeição.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <Coffee size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Como informar restrições alimentares?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  É muito importante que você informe suas restrições alimentares para que a equipe da cozinha possa preparar alternativas adequadas para você.
                </p>
                <p className="mb-2">
                  Para informar ou atualizar suas restrições alimentares:
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Acesse o menu "Configurações" no canto inferior direito da tela.</li>
                  <li>Selecione a opção "Restrições Alimentares".</li>
                  <li>Escolha se você tem ou não restrições alimentares.</li>
                  <li>Se tiver, descreva detalhadamente suas restrições no campo apropriado.</li>
                  <li>Toque em "Salvar Alterações" para confirmar.</li>
                </ol>
                <p className="mt-2">
                  Suas restrições ficarão visíveis para a equipe de nutrição, que adaptará o cardápio para suas necessidades sempre que possível.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <MessagesSquare size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Como enviar feedback sobre as refeições?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  Seu feedback é muito importante para melhorarmos continuamente a qualidade das refeições. Você pode enviar comentários positivos ou sugestões de melhoria.
                </p>
                <p className="mb-2">
                  Para enviar feedback:
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Na tela principal, após consumir uma refeição, toque no botão "Enviar Feedback".</li>
                  <li>Selecione o tipo de feedback: positivo ou sugestão.</li>
                  <li>Escreva seu comentário no campo de texto.</li>
                  <li>Toque em "Enviar" para submeter seu feedback.</li>
                </ol>
                <p className="mt-2">
                  Todos os feedbacks são analisados pela equipe de nutrição e levados em consideração no planejamento futuro dos cardápios.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <User size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Como atualizar meus dados pessoais?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  Para manter seu perfil atualizado:
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Acesse o menu "Configurações" no canto inferior direito da tela.</li>
                  <li>Selecione a opção "Dados Pessoais".</li>
                  <li>Atualize as informações necessárias.</li>
                  <li>Toque em "Salvar" para confirmar as alterações.</li>
                </ol>
                <p className="mt-2">
                  É importante manter seus dados atualizados, especialmente informações de contato, para receber comunicados importantes sobre a alimentação escolar.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <LockKeyhole size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Esqueci minha senha. O que fazer?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-2">
                  Se você esqueceu sua senha, siga estes passos para recuperá-la:
                </p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Na tela de login, toque em "Esqueceu sua senha?".</li>
                  <li>Digite sua matrícula ou e-mail cadastrado.</li>
                  <li>Siga as instruções enviadas para seu e-mail para criar uma nova senha.</li>
                </ol>
                <p className="mt-2">
                  Caso continue com problemas para acessar sua conta, entre em contato com o suporte técnico através do e-mail vamosmerendar@example.com.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border border-gray-200 rounded-lg mb-3 px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center">
                  <Clock size={18} className="text-primary mr-3" />
                  <span className="text-left font-medium">Qual o horário das refeições?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-700">
                <p className="mb-3">
                  Os horários padrão das refeições são:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                    <span className="font-medium">Café da manhã:</span>
                    <span>7:00 - 8:00</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                    <span className="font-medium">Almoço:</span>
                    <span>11:30 - 13:30</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                    <span className="font-medium">Lanche:</span>
                    <span>15:30 - 16:30</span>
                  </div>
                </div>
                <p className="mt-3">
                  Estes horários podem variar dependendo do calendário escolar ou eventos especiais. Qualquer alteração será comunicada com antecedência.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 bg-primary/5 rounded-lg p-6 text-center border border-primary/10">
            <h3 className="font-medium text-primary mb-2">Não encontrou o que procurava?</h3>
            <p className="text-gray-700 mb-4">
              Entre em contato com nossa equipe de suporte para obter ajuda personalizada.
            </p>
            <a 
              href="mailto:vamosmerendar@example.com"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contatar Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
