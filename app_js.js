import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder, 
  FolderOpen,
  Star,
  Clock,
  BarChart3,
  Settings,
  Save,
  Cloud
} from 'lucide-react';

const LearningPlatform = () => {
  const [selectedCourse, setSelectedCourse] = useState('sales-forecast');
  const [expandedSections, setExpandedSections] = useState(new Set(['1', '3']));
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, saving, saved, error

  // Données par défaut
  const defaultCourses = {
    'sales-forecast': {
      id: 'sales-forecast',
      title: 'Prévision des ventes',
      type: 'Manuel',
      description: 'Manuel complet sur les techniques et méthodes de prévision des ventes',
      progress: 65,
      totalDocuments: 8,
      lastAccessed: '2025-01-06',
      difficulty: 'Intermédiaire',
      estimatedTime: '40h',
      chapters: [
        {
          id: '1',
          number: '1',
          title: 'Pourquoi élaborer des prévisions des ventes ?',
          documents: [
            { id: 'd1', name: 'Introduction concepts de base', type: 'note', starred: true },
            { id: 'd2', name: 'Cas pratique retail.pdf', type: 'pdf', starred: false }
          ],
          subsections: [
            { id: '1.1', number: '1.1', title: 'La prévision économique de l\'optimisation' },
            { id: '1.2', number: '1.2', title: 'L\'obligation de prévoir liée aux délais de réaction' }
          ]
        },
        {
          id: '2',
          number: '2', 
          title: 'Ce qui caractérise un problème de prévision',
          documents: [],
          subsections: []
        },
        {
          id: '3',
          number: '3',
          title: 'Ce qui caractérise une solution prévision',
          documents: [],
          subsections: [
            { id: '3.1', number: '3.1', title: 'Les données à prévoir' },
            { id: '3.2', number: '3.2', title: 'Périodicité de la prévision et horizon' },
            { id: '3.3', number: '3.3', title: 'Quelle(s) méthode(s) choisir ?' },
            { id: '3.4', number: '3.4', title: 'Solution informatique et système d\'informations' },
            { id: '3.5', number: '3.5', title: 'La prévision et sa validation' }
          ]
        }
      ]
    },
    'data-science': {
      id: 'data-science',
      title: 'Data Science Foundations',
      type: 'Formation en ligne',
      description: 'Formation complète aux fondamentaux de la data science',
      progress: 30,
      totalDocuments: 12,
      lastAccessed: '2025-01-05',
      difficulty: 'Débutant',
      estimatedTime: '60h',
      chapters: []
    }
  };

  const [courses, setCourses] = useState(defaultCourses);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem('learning-platform-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCourses(parsed.courses || defaultCourses);
        setSelectedCourse(parsed.selectedCourse || 'sales-forecast');
        setExpandedSections(new Set(parsed.expandedSections || ['1', '3']));
        setLastSync(parsed.lastSync);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage
  const saveData = () => {
    setSyncStatus('saving');
    try {
      const dataToSave = {
        courses,
        selectedCourse,
        expandedSections: Array.from(expandedSections),
        lastSync: new Date().toISOString()
      };
      localStorage.setItem('learning-platform-data', JSON.stringify(dataToSave));
      setLastSync(dataToSave.lastSync);
      setSyncStatus('saved');
      
      // Réinitialiser le statut après 2 secondes
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Auto-sauvegarde lors des changements
  useEffect(() => {
    const timeoutId = setTimeout(saveData, 1000); // Sauvegarde après 1 seconde d'inactivité
    return () => clearTimeout(timeoutId);
  }, [courses, selectedCourse, expandedSections]);

  const currentCourse = courses[selectedCourse];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'note': return '📓';
      case 'doc': return '📝';
      default: return '📎';
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'saving': return <div className="animate-spin"><Cloud size={16} /></div>;
      case 'saved': return <Cloud size={16} className="text-green-600" />;
      case 'error': return <Cloud size={16} className="text-red-600" />;
      default: return <Save size={16} className="text-gray-400" />;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'saving': return 'Sauvegarde...';
      case 'saved': return 'Sauvegardé';
      case 'error': return 'Erreur de sauvegarde';
      default: return lastSync ? `Dernière sync: ${new Date(lastSync).toLocaleTimeString()}` : 'Non sauvegardé';
    }
  };

  const CourseCard = ({ course, isSelected, onClick }) => (
    <div
      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg transform scale-105' 
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {course.type === 'Manuel' ? (
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          ) : (
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.type}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          course.difficulty === 'Débutant' ? 'bg-green-100 text-green-700' :
          course.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {course.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <FileText size={12} />
            <span>{course.totalDocuments} documents</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{course.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TreeSection = ({ section, level = 0 }) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;
    const hasDocuments = section.documents && section.documents.length > 0;
    const isExpanded = expandedSections.has(section.id);
    const indent = level * 24;

    return (
      <div className="select-none">
        <div 
          className={`flex items-center justify-between py-3 px-4 hover:bg-blue-50 rounded-lg transition-colors group cursor-pointer ${
            level === 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : ''
          }`}
          style={{ paddingLeft: `${16 + indent}px` }}
          onClick={() => (hasSubsections || hasDocuments) && toggleSection(section.id)}
        >
          <div className="flex items-center min-w-0 flex-1">
            {(hasSubsections || hasDocuments) ? (
              <div className="flex items-center mr-3">
                {isExpanded ? (
                  <>
                    <ChevronDown size={16} className="text-blue-600" />
                    <FolderOpen size={16} className="ml-1 text-blue-600" />
                  </>
                ) : (
                  <>
                    <ChevronRight size={16} className="text-blue-600" />
                    <Folder size={16} className="ml-1 text-blue-600" />
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center mr-3">
                <div className="w-4"></div>
                <FileText size={14} className="ml-1 text-gray-400" />
              </div>
            )}
            
            <span className={`truncate ${level === 0 ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
              {section.number && (
                <span className="text-blue-600 font-mono mr-2">{section.number}</span>
              )}
              {section.title}
            </span>
            
            {hasDocuments && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {section.documents.length} doc{section.documents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-blue-200 rounded-lg transition-all"
            title="Ajouter un document"
          >
            <Plus size={14} className="text-blue-600" />
          </button>
        </div>
        
        {(hasSubsections || hasDocuments) && isExpanded && (
          <div className="ml-4 mt-2 space-y-1">
            {/* Documents */}
            {hasDocuments && section.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center py-2 px-4 hover:bg-gray-50 rounded-lg group cursor-pointer"
                style={{ paddingLeft: `${32 + indent}px` }}
              >
                <span className="mr-3 text-lg">{getFileIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                  {doc.starred && (
                    <Star size={12} className="ml-2 text-yellow-500 fill-current inline" />
                  )}
                </div>
              </div>
            ))}
            
            {/* Subsections */}
            {hasSubsections && section.subsections.map((subsection) => (
              <TreeSection key={subsection.id} section={subsection} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Ma Plateforme d'Apprentissage
                </h1>
                <p className="text-gray-600 mt-1">Organisez et suivez vos formations de manière intelligente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Indicateur de synchronisation */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200">
                {getSyncIcon()}
                <span className="text-xs text-gray-600">{getSyncText()}</span>
              </div>
              
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors" title="Statistiques">
                <BarChart3 size={20} className="text-gray-600" />
              </button>
              
              <button 
                onClick={saveData}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors" 
                title="Sauvegarder manuellement"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <div className="w-96 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mes Formations</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                title="Ajouter une formation"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.values(courses).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isSelected={selectedCourse === course.id}
                  onClick={() => setSelectedCourse(course.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    {currentCourse.type === 'Manuel' ? (
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <BookOpen size={28} className="text-blue-600" />
                      </div>
                    ) : (
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <GraduationCap size={28} className="text-purple-600" />
                      </div>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900">{currentCourse.title}</h2>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">{currentCourse.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{currentCourse.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{currentCourse.difficulty}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{currentCourse.estimatedTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FileText size={14} />
                      <span>{currentCourse.totalDocuments} documents</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2">Progression</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{currentCourse.progress}%</div>
                  <div className="w-40 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${currentCourse.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {currentCourse.chapters && currentCourse.chapters.length > 0 ? (
                <div className="space-y-3">
                  {currentCourse.chapters.map((chapter) => (
                    <TreeSection key={chapter.id} section={chapter} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl inline-block mb-6">
                    <BookOpen size={64} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Prêt à commencer ?</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Ajoutez du contenu à votre formation pour commencer à organiser vos apprentissages
                  </p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Ajouter du contenu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Fonctionnalité en développement</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                L'ajout de contenu sera disponible dans la prochaine version. 
                Vos données sont automatiquement sauvegardées localement !
              </p>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlatform;