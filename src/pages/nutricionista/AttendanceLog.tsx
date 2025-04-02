import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import BackButton from '../../components/ui/BackButton';
import { Search, User, Calendar, BarChart2, Table as TableIcon, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  name: string;
  matricula: string;
  profile_image?: string;
}

interface Attendance {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  snack: boolean;
}

const AttendanceLog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [confirmedStudent, setConfirmedStudent] = useState<Student | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceData(selectedStudent.id);
    }
  }, [selectedStudent]);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  useEffect(() => {
    if (searchTerm && confirmedStudent) {
      setConfirmedStudent(null);
      setAttendanceData([]);
    }
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, matricula, profile_image')
        .eq('user_type', 'aluno')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const fetchAttendanceData = async (studentId: string) => {
    try {
      const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
      const dates = Array.from({ length: 7 }, (_, i) => 
        format(addDays(startDate, i), 'yyyy-MM-dd')
      );

      const { data, error } = await supabase
        .from('meal_attendance')
        .select('*')
        .eq('student_id', studentId)
        .in('date', dates);

      if (error) throw error;

      // Criar um mapa de datas para facilitar o acesso
      const attendanceMap = new Map(
        data?.map(attendance => [attendance.date, attendance]) || []
      );

      // Formatar os dados para cada dia da semana
      const formattedData = dates.map(date => {
        const dayAttendance = attendanceMap.get(date);
        return {
          date,
          breakfast: dayAttendance?.breakfast || false,
          lunch: dayAttendance?.lunch || false,
          snack: dayAttendance?.snack || false
        };
      });

      console.log('Dados de presença:', formattedData); // Para debug
      setAttendanceData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
    }
  };

  const renderAttendanceTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dia</TableHead>
          <TableHead>Café da Manhã</TableHead>
          <TableHead>Almoço</TableHead>
          <TableHead>Lanche</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceData.map((day) => (
          <TableRow key={day.date}>
            <TableCell>
              {format(new Date(day.date), "EEEE", { locale: ptBR })}
            </TableCell>
            <TableCell>
              <div className={`w-3 h-3 rounded-full ${day.breakfast ? 'bg-[#f45b43]' : 'bg-gray-300'}`} />
            </TableCell>
            <TableCell>
              <div className={`w-3 h-3 rounded-full ${day.lunch ? 'bg-[#f45b43]' : 'bg-gray-300'}`} />
            </TableCell>
            <TableCell>
              <div className={`w-3 h-3 rounded-full ${day.snack ? 'bg-[#f45b43]' : 'bg-gray-300'}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderAttendanceChart = () => {
    const totalMeals = attendanceData.length * 3;
    const presentMeals = attendanceData.reduce((acc, day) => {
      return acc + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.snack ? 1 : 0);
    }, 0);
    const attendanceRate = (presentMeals / totalMeals) * 100;

    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-[#f45b43]">{attendanceRate.toFixed(1)}%</span>
            <p className="text-sm text-gray-500">Taxa de Presença Semanal</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#f45b43] h-2.5 rounded-full" 
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Café da Manhã', 'Almoço', 'Lanche'].map((meal, index) => {
            const mealKey = ['breakfast', 'lunch', 'snack'][index] as keyof Omit<Attendance, 'date'>;
            const presentCount = attendanceData.filter(day => day[mealKey]).length;
            const mealRate = (presentCount / attendanceData.length) * 100;

            return (
              <div key={meal} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-2">{meal}</h3>
                <div className="text-lg font-bold text-[#f45b43]">{mealRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">{presentCount} de {attendanceData.length} dias</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedStudent(null);
  };

  const handleConfirmStudent = () => {
    if (selectedStudent) {
      setConfirmedStudent(selectedStudent);
      fetchAttendanceData(selectedStudent.id);
      clearSearch(); // Limpa a busca após confirmar
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StatusBar />
      
      <div className="px-4">
        <BackButton 
          to="/nutricionista/dashboard"
          label="Diário de Presença"
          className="text-primary" 
        />
      </div>

      <div className="px-4 w-full max-w-7xl mx-auto mt-2">
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar aluno por nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {searchTerm && !confirmedStudent && (
            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedStudent?.id === student.id
                      ? 'bg-primary/10'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="w-10 h-10">
                    {student.profile_image ? (
                      <AvatarImage src={student.profile_image} alt={student.name} />
                    ) : (
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Matrícula: {student.matricula}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedStudent && !confirmedStudent && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleConfirmStudent}
                className="bg-[#244b2c] hover:bg-[#244b2c]/90 text-white"
              >
                <Check size={20} className="mr-2" />
                Confirmar Aluno
              </Button>
            </div>
          )}

          {confirmedStudent && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    {confirmedStudent.profile_image ? (
                      <AvatarImage src={confirmedStudent.profile_image} alt={confirmedStudent.name} />
                    ) : (
                      <AvatarFallback>
                        <User size={24} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-gray-900">{confirmedStudent.name}</h2>
                    <p className="text-sm text-gray-500">Matrícula: {confirmedStudent.matricula}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <TableIcon size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'chart'
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart2 size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {viewMode === 'table' ? renderAttendanceTable() : renderAttendanceChart()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog; 