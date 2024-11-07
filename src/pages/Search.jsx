import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import api from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get query parameters from URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get('query') || '';
  };

  // On component mount, check for query in URL
  useEffect(() => {
    const query = getQueryParams();
    if (query) {
      setSearchQuery(query);
      handleSearch(query); // Fetch results based on URL query
    }
  }, [location.search]); // Re-run when the search parameter changes

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    setLoading(true);
    setMessage(''); // Reset message on new search

    try {
      const response = await api.get(`search?query=${query}`);
      setSearchResults(response.data);
      navigate(`/search?query=${query}`); // Update URL without reloading the page

      if (response.data.length === 0) {
        setMessage('No results found.'); // Set message if no results
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setMessage('Error fetching search results. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  }, 500); // Adjust debounce delay as needed

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setSearchResults([]); // Clear results if the search term is empty
      setMessage('Please enter a search term.'); // Set message for empty search
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Container className="my-4">
      <h4 className="text-center mb-4 text-gold">Explore Clubs, People, or More</h4>

      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-4 shadow-lg">
          <FormControl
            placeholder="Start typing or press search..."
            className='p-3'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
          />
          <Button
            type="submit"
            variant="gold"
            style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
          >
            Search
          </Button>
        </InputGroup>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" variant="gold">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div>
          {message && <p className="text-center text-muted">{message}</p>} {/* Display feedback messages */}
          {searchResults.length > 0 && !message ? ( // Show results only if there's no message
            <Card className="shadow-lg mt-4">
              <Card.Body>
                <h5 className="text-secondary">Search Results</h5>
                <ul className="list-unstyled mt-3">
                  {searchResults.map((result) => (
                    <li key={result.id} className="mb-3">
                      <Card 
                        className="p-3 shadow-sm rounded"
                      >
                        <h6>{result.name}</h6>
                        <p className="text-muted">Email: {result.email}</p>
                        <div className="d-flex gap-2">
                          <button onClick={() => navigate(`/profile/${result.id}`)} className='btn btn-secondary'>View profile</button>
                          <button className='btn btn-gold'>Send message</button>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ) : null}
        </div>
      )}
    </Container>
  );
};

export default Search;
