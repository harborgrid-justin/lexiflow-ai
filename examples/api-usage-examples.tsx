/**
 * API Usage Examples for LexiFlow AI
 * Demonstrates type-safe API communication patterns
 */

import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import {
  transformApiUser,
  transformApiCase,
  transformApiDocument,
  transformers,
} from '../utils/type-transformers';
import {
  ApiUser,
  ApiCase,
  ApiDocument,
  CreateCaseRequest,
  UpdateUserRequest,
  AuthResponse,
} from '../shared-types';
import { User, Case, LegalDocument } from '../types';

// ==================== EXAMPLE 1: Authentication ====================

export const LoginExample: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = async () => {
    try {
      // API returns AuthResponse with snake_case user data
      const authResponse: AuthResponse = await ApiService.login(email, password);

      // Store token
      ApiService.setAuthToken(authResponse.access_token);

      // Transform user data to frontend format
      const apiUser: ApiUser = authResponse.user as any; // Cast needed due to partial user in AuthResponse
      const user = transformApiUser({
        ...apiUser,
        name: `${apiUser.first_name} ${apiUser.last_name}`,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      } as ApiUser);

      setCurrentUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {currentUser && <div>Welcome, {currentUser.name}!</div>}
    </div>
  );
};

// ==================== EXAMPLE 2: Fetching and Displaying Cases ====================

export const CaseListExample: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // API returns ApiCase[] with snake_case fields
        const apiCases: ApiCase[] = await ApiService.getCases();

        // Transform to frontend format
        const transformedCases = transformers.cases(apiCases);

        setCases(transformedCases);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {cases.map((caseItem) => (
        <li key={caseItem.id}>
          <h3>{caseItem.title}</h3>
          <p>Client: {caseItem.client}</p>
          <p>Status: {caseItem.status}</p>
          <p>Filed: {caseItem.filingDate}</p>
        </li>
      ))}
    </ul>
  );
};

// ==================== EXAMPLE 3: Creating a New Case ====================

export const CreateCaseExample: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    opposingCounsel: '',
    matterType: 'Litigation' as const,
    jurisdiction: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Build API request using snake_case
      const request: CreateCaseRequest = {
        title: formData.title,
        client_name: formData.clientName, // Note: snake_case for API
        opposing_counsel: formData.opposingCounsel,
        matter_type: formData.matterType,
        jurisdiction: formData.jurisdiction,
        status: 'active',
      };

      // API returns ApiCase
      const apiCase: ApiCase = await ApiService.createCase(request);

      // Transform to frontend format
      const newCase = transformApiCase(apiCase);

      console.log('Created case:', newCase);
      alert(`Case created: ${newCase.title}`);

      // Reset form
      setFormData({
        title: '',
        clientName: '',
        opposingCounsel: '',
        matterType: 'Litigation',
        jurisdiction: '',
      });
    } catch (error) {
      console.error('Failed to create case:', error);
      alert('Failed to create case');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Case Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        placeholder="Client Name"
        value={formData.clientName}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
      />
      <input
        placeholder="Opposing Counsel"
        value={formData.opposingCounsel}
        onChange={(e) => setFormData({ ...formData, opposingCounsel: e.target.value })}
      />
      <button type="submit">Create Case</button>
    </form>
  );
};

// ==================== EXAMPLE 4: Updating User Profile ====================

export const UpdateUserExample: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: '',
    position: '',
    expertise: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const apiUser: ApiUser = await ApiService.getUser(userId);
      const transformedUser = transformApiUser(apiUser);
      setUser(transformedUser);

      // Initialize edit form
      setEditData({
        phone: apiUser.phone || '',
        position: apiUser.position || '',
        expertise: apiUser.expertise || '',
      });
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      // Build update request using snake_case
      const updateRequest: UpdateUserRequest = {
        phone: editData.phone,
        position: editData.position,
        expertise: editData.expertise,
      };

      // API returns updated ApiUser
      const updatedApiUser: ApiUser = await ApiService.updateUser(userId, updateRequest);

      // Transform and update state
      const updatedUser = transformApiUser(updatedApiUser);
      setUser(updatedUser);
      setEditing(false);

      alert('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      {editing ? (
        <>
          <input
            placeholder="Phone"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
          <input
            placeholder="Position"
            value={editData.position}
            onChange={(e) => setEditData({ ...editData, position: e.target.value })}
          />
          <textarea
            placeholder="Expertise"
            value={editData.expertise}
            onChange={(e) => setEditData({ ...editData, expertise: e.target.value })}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Role: {user.role}</p>
          <p>Office: {user.office}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

// ==================== EXAMPLE 5: Case Documents with Relationships ====================

export const CaseDocumentsExample: React.FC<{ caseId: string }> = ({ caseId }) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      // API returns ApiDocument[] with optional relations
      const apiDocs: ApiDocument[] = await ApiService.getCaseDocuments(caseId);

      // Transform all documents
      const transformedDocs = transformers.documents(apiDocs);

      setDocuments(transformedDocs);
    };

    fetchDocuments();
  }, [caseId]);

  return (
    <div>
      <h3>Case Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.title}</strong>
            <span> ({doc.type})</span>
            <span> - {doc.status}</span>
            {doc.fileSize && <span> - {doc.fileSize}</span>}
            <p>{doc.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================== EXAMPLE 6: Custom Hook Pattern ====================

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const apiCases = await ApiService.getCases();
      const transformed = transformers.cases(apiCases);
      setCases(transformed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (request: CreateCaseRequest) => {
    const apiCase = await ApiService.createCase(request);
    const newCase = transformApiCase(apiCase);
    setCases((prev) => [...prev, newCase]);
    return newCase;
  };

  const updateCase = async (id: string, updates: Partial<CreateCaseRequest>) => {
    const apiCase = await ApiService.updateCase(id, updates);
    const updatedCase = transformApiCase(apiCase);
    setCases((prev) => prev.map((c) => (c.id === id ? updatedCase : c)));
    return updatedCase;
  };

  const deleteCase = async (id: string) => {
    await ApiService.deleteCase(id);
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    error,
    refetch: fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};

// Usage of the custom hook
export const CaseManagementExample: React.FC = () => {
  const { cases, loading, error, createCase, updateCase, deleteCase } = useCases();

  if (loading) return <div>Loading cases...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Case Management</h2>
      <p>Total cases: {cases.length}</p>
      <ul>
        {cases.map((caseItem) => (
          <li key={caseItem.id}>
            {caseItem.title}
            <button onClick={() => deleteCase(caseItem.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================== EXAMPLE 7: Error Handling ====================

export const ErrorHandlingExample: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const handleApiCall = async () => {
    try {
      const apiCases = await ApiService.getCases();
      setResult(`Fetched ${apiCases.length} cases`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // Handle unauthorized - redirect to login
          setResult('Session expired. Please login again.');
          ApiService.clearAuthToken();
          window.location.href = '/login';
        } else if (error.message.includes('404')) {
          setResult('Resource not found');
        } else if (error.message.includes('500')) {
          setResult('Server error. Please try again later.');
        } else {
          setResult(`Error: ${error.message}`);
        }
      }
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>Test API Call</button>
      <p>{result}</p>
    </div>
  );
};
