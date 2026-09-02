import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMockStore, API_URL } from '../store/mockStore';
import { FuelType, TransmissionType, BodyType, AvailabilityType, VehicleImage } from '../types';
import { 
  ChevronRight, ChevronLeft, Check, CheckCircle2, 
  UploadCloud, Star, Trash2, Camera, Image as ImageIcon, ArrowLeft, ArrowRight, Loader2
} from 'lucide-react';
import { compressImage } from '../utils/compression';

import { EQUIPMENTS_BY_CATEGORY } from '../config/equipments';

export default function AdminNewListing() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { vehicles, addListing, updateListing } = useMockStore();

  // Stable vehicle ID: reuse existing ID when editing, otherwise generate a new one for creation
  const [vehicleId] = useState(() => id || 'veh-' + Date.now() + '-' + Math.floor(Math.random() * 1000));

  const [step, setStep] = useState(1);

  // Step 1: Info State
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState<FuelType>('Essence');
  const [transmission, setTransmission] = useState<TransmissionType>('Automatique');
  const [bodyType, setBodyType] = useState<BodyType>('SUV');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('Dakar');
  const [condition, setCondition] = useState<'Neuf' | 'Occasion Europe' | 'Occasion Sénégal'>('Occasion Europe');
  const [availability, setAvailability] = useState<AvailabilityType>('Disponible');

  // Step 2: Equipments State
  const [equipments, setEquipments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    EQUIPMENTS_BY_CATEGORY.map(c => c.id) // All expanded by default
  );

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleSelectAllCategory = (catId: string, items: string[]) => {
    const allSelected = items.every(item => equipments.includes(item));
    if (allSelected) {
      setEquipments(prev => prev.filter(item => !items.includes(item)));
    } else {
      setEquipments(prev => {
        const otherItems = prev.filter(item => !items.includes(item));
        return [...otherItems, ...items];
      });
    }
  };

  // Step 3: Photos State (Stores list of structured VehicleImage objects)
  const [uploadedPhotos, setUploadedPhotos] = useState<VehicleImage[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Step 4: Description
  const [description, setDescription] = useState('');

  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (id && vehicles.length > 0 && !isLoaded) {
      const v = vehicles.find(item => item.id === id);
      if (v) {
        setBrand(v.brand);
        setModel(v.model);
        setYear(String(v.year));
        setPrice(String(v.price));
        setMileage(String(v.mileage));
        setFuel(v.fuel);
        setTransmission(v.transmission);
        setBodyType(v.bodyType);
        setColor(v.color || '');
        setLocation(v.location);
        setCondition(v.condition as any);
        setAvailability(v.availability);
        setEquipments(v.equipments || []);
        
        // Populate photos list: map legacy string array to VehicleImage if imageObjects is missing
        if (v.imageObjects && v.imageObjects.length > 0) {
          setUploadedPhotos(v.imageObjects);
        } else if (v.images && v.images.length > 0) {
          setUploadedPhotos(v.images.map((url, idx) => ({
            id: `legacy-${idx}-${Date.now()}`,
            url,
            publicId: '',
            order: idx
          })));
        } else {
          setUploadedPhotos([]);
        }
        
        setPrimaryPhoto(v.primaryImage || '');
        setDescription(v.description || '');
        setIsLoaded(true);
      }
    }
  }, [id, vehicles, isLoaded]);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const toggleEquipment = (eq: string) => {
    setEquipments(prev => 
      prev.includes(eq) ? prev.filter(item => item !== eq) : [...prev, eq]
    );
  };

  // Compresses and uploads multiple photos in a single batch
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (uploadedPhotos.length + files.length > 7) {
      toast.error('Vous pouvez ajouter jusqu\'à 7 photos maximum par véhicule.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Téléversement des photos en cours...');
    const formData = new FormData();

    try {
      // Compress each photo client-side
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Le fichier "${file.name}" est trop lourd (10 Mo maximum).`, { id: toastId });
          setIsUploading(false);
          return;
        }
        const compressedBlob = await compressImage(file);
        formData.append('photos', compressedBlob, file.name);
      }

      const token = localStorage.getItem('autoelite_token');
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedPhotos(data.imageObjects);
        setPrimaryPhoto(data.primaryImage);
        toast.success('Photos ajoutées avec succès !', { id: toastId });
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Erreur lors du téléversement.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Une erreur réseau est survenue lors de l\'upload.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Deletes an image from the listing (and from Cloudinary)
  const handleRemovePhoto = async (photo: VehicleImage) => {
    if (!photo.publicId) {
      // Fallback local deletion for mockup/legacy images
      setUploadedPhotos(prev => {
        const next = prev.filter(p => p.id !== photo.id);
        if (primaryPhoto === photo.url && next.length > 0) {
          setPrimaryPhoto(next[0].url);
        } else if (next.length === 0) {
          setPrimaryPhoto('');
        }
        return next;
      });
      toast.success('Photo supprimée');
      return;
    }

    try {
      const token = localStorage.getItem('autoelite_token');
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}/images/${photo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedPhotos(data.imageObjects);
        setPrimaryPhoto(data.primaryImage);
        toast.success('Photo supprimée avec succès.');
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression de la photo.');
    }
  };

  // Sets a photo as the primaryImage
  const handleSetPrimary = async (photo: VehicleImage) => {
    if (!photo.publicId) {
      setPrimaryPhoto(photo.url);
      toast.success('Photo principale définie.');
      return;
    }

    try {
      const token = localStorage.getItem('autoelite_token');
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}/images/${photo.id}/primary`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPrimaryPhoto(data.primaryImage);
        toast.success('Photo principale mise à jour !');
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Erreur lors du changement de photo principale.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur de communication avec le serveur.');
    }
  };

  // Reorders photos using left/right swapping
  const handleMovePhoto = async (index: number, direction: 'left' | 'right') => {
    const newPhotos = [...uploadedPhotos];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    setUploadedPhotos(newPhotos);

    const hasPublicIds = newPhotos.some(p => p.publicId);
    if (!hasPublicIds) {
      setPrimaryPhoto(newPhotos[0].url);
      return;
    }

    try {
      const token = localStorage.getItem('autoelite_token');
      const imageIds = newPhotos.map(p => p.id);
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}/images/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageIds })
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedPhotos(data.imageObjects);
        setPrimaryPhoto(data.primaryImage);
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Erreur lors de la réorganisation.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    const vehicleData = {
      id: vehicleId,
      brand,
      model,
      year: parseInt(year),
      price: parseInt(price),
      mileage: parseInt(mileage),
      fuel,
      transmission,
      bodyType,
      color,
      location,
      condition,
      description,
      equipments,
      images: uploadedPhotos.map(p => p.url),
      primaryImage: primaryPhoto,
      availability
    };

    if (isEditMode && id) {
      await updateListing(id, vehicleData);
    } else {
      await addListing(vehicleData);
    }
    handleNext(); // proceed to Step 6: Success
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 text-slate-900 animate-fade-in">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-black">
          {isEditMode ? `Modifier le véhicule : ${brand} ${model}` : 'Ajouter un nouveau véhicule'}
        </h1>
        <p className="text-xs text-black/60 mt-1">
          {isEditMode ? 'Enregistrez les modifications apportées à la fiche de ce véhicule.' : 'Exposez directement une nouvelle voiture dans le catalogue public.'}
        </p>
      </div>

      {/* Progress timeline */}
      {step <= 5 && (
        <div className="bg-black/5 border border-black/5 p-4 rounded-xl shadow-sm flex justify-between items-center text-[10px] font-bold text-black/60 max-w-xl">
          {[
            { s: 1, name: 'Informations' },
            { s: 2, name: 'Équipements' },
            { s: 3, name: 'Photos' },
            { s: 4, name: 'Description' },
            { s: 5, name: 'Aperçu' }
          ].map((item) => (
            <div key={item.s} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                step === item.s ? 'bg-black text-white border-black' : 
                step > item.s ? 'bg-emerald-500 text-white border-emerald-500' : 'border-black/10'
              }`}>
                {step > item.s ? '✓' : item.s}
              </span>
              <span className={`hidden sm:inline ${step === item.s ? 'text-black' : ''}`}>{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Steps panel containers */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm max-w-3xl">
        
        {/* Step 1: Info Form */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">Informations Générales</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Marque *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Toyota, Peugeot..." 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                  className="form-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Modèle *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: RAV4, 3008..." 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)} 
                  className="form-input" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Année *</label>
                <input 
                  type="number" 
                  required 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)} 
                  className="form-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Kilométrage (km) *</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 45000" 
                  value={mileage} 
                  onChange={(e) => setMileage(e.target.value)} 
                  className="form-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Prix (FCFA) *</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 15000000" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="form-input" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Carburant</label>
                <select value={fuel} onChange={(e) => setFuel(e.target.value as FuelType)} className="form-input">
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Transmission</label>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value as TransmissionType)} className="form-input">
                  <option value="Automatique">Automatique</option>
                  <option value="Manuelle">Manuelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">Carrosserie</label>
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value as BodyType)} className="form-input">
                  <option value="SUV">SUV</option>
                  <option value="Berline">Berline</option>
                  <option value="Citadine">Citadine</option>
                  <option value="4x4">4x4</option>
                  <option value="Coupé">Coupé</option>
                  <option value="Utilitaire">Utilitaire</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Couleur</label>
                <input type="text" placeholder="Ex: Noir" value={color} onChange={(e) => setColor(e.target.value)} className="form-input" />
              </div>
              <div className="space-y-1.5">
                <label className="form-label">Localisation</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="form-input">
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Mbour">Mbour</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Saly">Saly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="form-label">État</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="form-input">
                  <option value="Occasion Europe">Occasion Europe</option>
                  <option value="Occasion Sénégal">Occasion Sénégal</option>
                  <option value="Neuf">Neuf</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="form-label font-bold text-slate-700">Disponibilité (Stock) *</label>
                <select value={availability} onChange={(e) => setAvailability(e.target.value as AvailabilityType)} className="form-input">
                  <option value="Disponible">Disponible immédiatement</option>
                  <option value="Sous douane">Sous douane</option>
                  <option value="Sur commande">Sur commande</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!brand || !model || !price || !mileage}
                className="btn-primary py-2 px-6 text-xs disabled:opacity-50"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Equipments */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Sélectionnez les Équipements</h2>
                <p className="text-xs text-slate-500 mt-0.5">Sélectionnez les options et commodités présentes sur le véhicule.</p>
              </div>
              <span className="bg-accent-700/10 text-accent-700 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 self-start sm:self-center">
                {equipments.length} équipement{equipments.length > 1 ? 's' : ''} sélectionné{equipments.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Rechercher un équipement (ex: CarPlay, Caméra...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-9"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 text-xs">
                  🔍
                </span>
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                  >
                    Vider
                  </button>
                )}
              </div>
              {equipments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEquipments([])}
                  className="btn-secondary py-2 px-4 text-xs font-bold border-red-200 hover:border-red-300 text-red-650 hover:bg-red-50/20 transition-colors"
                >
                  Tout désélectionner
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {EQUIPMENTS_BY_CATEGORY.map((cat) => {
                // Filter items in this category by search term
                const filteredItems = cat.items.filter(item => 
                  item.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                const isExpanded = expandedCategories.includes(cat.id);
                const categorySelectedCount = cat.items.filter(item => equipments.includes(item)).length;
                const allCategorySelected = cat.items.every(item => equipments.includes(item));

                return (
                  <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    {/* Header Accordion */}
                    <div 
                      onClick={() => toggleCategoryExpand(cat.id)}
                      className="flex items-center justify-between p-4 bg-slate-50/50 cursor-pointer border-b border-slate-100 select-none hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <div>
                          <h3 className="text-xs font-bold text-slate-800">{cat.name}</h3>
                          <span className="text-[10px] text-slate-505 font-semibold">
                            {categorySelectedCount} / {cat.items.length} sélectionné{categorySelectedCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {/* Select All category toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSelectAllCategory(cat.id, cat.items)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                            allCategorySelected 
                              ? 'bg-accent-700 text-white border-accent-700' 
                              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {allCategorySelected ? 'Tout retirer' : 'Tout cocher'}
                        </button>
                        
                        {/* Arrow Collapse */}
                        <span 
                          onClick={() => toggleCategoryExpand(cat.id)}
                          className={`text-slate-400 text-xs transition-transform duration-200 cursor-pointer ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Grid of Items */}
                    {isExpanded && (
                      <div className="p-4 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {filteredItems.map((item) => {
                            const isSelected = equipments.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleEquipment(item)}
                                className={`p-3 rounded-xl border text-left text-[11px] font-semibold flex items-center justify-between transition-all ${
                                  isSelected
                                    ? 'border-accent-700 bg-accent-700/5 text-accent-700 ring-2 ring-accent-700/5 font-bold'
                                    : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50/50'
                                }`}
                              >
                                <span className="pr-2">{item}</span>
                                {isSelected && <span className="text-accent-700 text-xs font-bold">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* If all categories filtered out */}
              {EQUIPMENTS_BY_CATEGORY.every(cat => 
                cat.items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())).length === 0
              ) && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-slate-500 text-xs">
                  Aucun équipement ne correspond à votre recherche.
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button type="button" onClick={handlePrev} className="btn-secondary py-2 px-5 text-xs">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button type="button" onClick={handleNext} className="btn-primary py-2 px-6 text-xs">
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h2 className="text-base font-bold text-slate-800">Gestionnaire de Photos</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                uploadedPhotos.length >= 7 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-650'
              }`}>
                {uploadedPhotos.length} / 7 photos
              </span>
            </div>
            
            {/* 📸 Conseils pour vos photos */}
            <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl space-y-2.5 text-xs text-slate-650 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-sm">📸</span>
                <h4>Conseils pour vos photos</h4>
              </div>
              <p className="text-[11px] leading-relaxed">
                Prenez des photos nettes, bien éclairées et sous plusieurs angles pour présenter le véhicule sous son meilleur jour. Vous pouvez photographier le véhicule directement avec votre téléphone ou choisir des images dans votre galerie.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1 border-t border-slate-250/20">
                <span>• 7 photos maximum</span>
                <span>• JPG, PNG, WEBP</span>
                <span>• Optimisation automatique</span>
              </div>
            </div>

            {/* Hidden upload inputs */}
            <input 
              type="file" 
              id="camera-file-input" 
              accept="image/jpeg,image/png,image/webp" 
              capture="environment" 
              className="hidden" 
              onChange={(e) => handleUploadFiles(e.target.files)} 
            />
            <input 
              type="file" 
              id="gallery-file-input" 
              accept="image/jpeg,image/png,image/webp" 
              multiple 
              className="hidden" 
              onChange={(e) => handleUploadFiles(e.target.files)} 
            />

            {/* Split upload options or loading spinner */}
            {isUploading ? (
              <div className="border-2 border-dashed border-accent-700 bg-accent-700/5 rounded-2xl p-10 text-center space-y-3 flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 text-accent-700 animate-spin" />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Optimisation et envoi en cours...</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Veuillez patienter pendant la compression des photos</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('camera-file-input')?.click()}
                  disabled={uploadedPhotos.length >= 7}
                  className="border-2 border-dashed border-slate-200 hover:border-accent-700 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-accent-700 transition-colors" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 group-hover:text-slate-800">Prendre une photo</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Ouvre l'appareil photo de l'appareil</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-file-input')?.click()}
                  disabled={uploadedPhotos.length >= 7}
                  className="border-2 border-dashed border-slate-200 hover:border-accent-700 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-accent-700 transition-colors" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 group-hover:text-slate-800">Choisir depuis la galerie</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Sélectionner plusieurs photos</span>
                  </div>
                </button>
              </div>
            )}

            {/* Photos previews list */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {uploadedPhotos.map((photo, idx) => {
                  const isPrimary = primaryPhoto === photo.url;
                  return (
                    <div key={photo.id || idx} className={`group relative aspect-video rounded-xl overflow-hidden border-2 bg-slate-100 flex items-center justify-center transition-all ${
                      isPrimary ? 'border-accent-700 shadow-md ring-2 ring-accent-700/10' : 'border-slate-100 hover:border-slate-300'
                    }`}>
                      <img src={photo.url} alt="upload preview" className="w-full h-full object-cover" />
                      
                      {/* Top Action overlay controls */}
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        {/* Primary Image selector */}
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSetPrimary(photo); }}
                          title="Définir comme photo principale"
                          className={`p-1.5 rounded-full shadow-sm backdrop-blur-xs transition-colors ${
                            isPrimary ? 'bg-accent-700 text-white' : 'bg-slate-900/75 hover:bg-slate-900 text-white'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        {/* Delete photo */}
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemovePhoto(photo); }}
                          title="Supprimer la photo"
                          className="p-1.5 bg-red-600/90 hover:bg-red-650 text-white rounded-full shadow-sm backdrop-blur-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Reordering controls */}
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleMovePhoto(idx, 'left'); }}
                            title="Déplacer vers la gauche"
                            className="p-1 bg-slate-900/75 hover:bg-slate-900 text-white rounded shadow-xs backdrop-blur-xs transition-colors"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {idx < uploadedPhotos.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleMovePhoto(idx, 'right'); }}
                            title="Déplacer vers la droite"
                            className="p-1 bg-slate-900/75 hover:bg-slate-900 text-white rounded shadow-xs backdrop-blur-xs transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Primary sticker */}
                      {isPrimary && (
                        <span className="absolute bottom-2 left-2 bg-accent-700 text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                          ★ Principale
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Nav actions */}
            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button type="button" onClick={handlePrev} className="btn-secondary py-2 px-5 text-xs">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={uploadedPhotos.length === 0 || isUploading}
                className="btn-primary py-2 px-6 text-xs disabled:opacity-50"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Description */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">Description du Véhicule</h2>
            
            <div className="space-y-1.5">
              <label className="form-label">Rédigez l'annonce *</label>
              <textarea 
                rows={5}
                required
                placeholder="Indiquez l'historique d'entretien, l'état général..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input resize-none"
              />
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button type="button" onClick={handlePrev} className="btn-secondary py-2 px-5 text-xs">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={!description.trim()}
                className="btn-primary py-2 px-6 text-xs disabled:opacity-50"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Aperçu */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2">Aperçu en direct de la carte publique</h2>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 max-w-lg shadow-sm text-xs">
              <img src={primaryPhoto} alt="preview main" className="w-full md:w-40 h-28 object-cover rounded-lg" />
              <div className="flex-grow space-y-3">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">{brand}</span>
                  <h3 className="font-bold text-sm text-slate-800">{model}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">📍 {location}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase border-y border-slate-100 py-1">
                  <span>{year}</span>
                  <span>{fuel}</span>
                  <span>{transmission}</span>
                </div>
                <span className="block font-display font-extrabold text-accent-700 text-sm">
                  {parseInt(price || '0').toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button type="button" onClick={handlePrev} className="btn-secondary py-2 px-5 text-xs">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn-primary py-2 px-6 text-xs bg-black text-white hover:bg-black/90"
              >
                {isEditMode ? 'Enregistrer les modifications' : 'Publier le véhicule'}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="text-center py-8 space-y-6 animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">
                {isEditMode ? 'Modifications Enregistrées !' : 'Véhicule Publié !'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {isEditMode 
                  ? 'Les modifications du véhicule ont été enregistrées avec succès dans la base de données.'
                  : 'Le véhicule a été ajouté à la base de données. Il est immédiatement visible et accessible par les visiteurs sur le catalogue public.'}
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => navigate('/admin/vehicules')} 
                className="btn-primary py-2 px-6 text-xs"
              >
                Gérer les véhicules
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
