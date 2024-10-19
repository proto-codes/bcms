import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const handleSearch = async (query = searchQuery) => {
    setLoading(true);
    setMessage(''); // Reset message on new search

    try {
      const response = await axios.get(`http://localhost:8000/api/search?query=${query}`);
      setSearchResults(response.data);

      // Update URL without reloading the page
      navigate(`/search?query=${query}`);

      if (response.data.length === 0) {
        setMessage('No results found.'); // Set message if no results
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setMessage('Error fetching search results. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setMessage('Please enter a search term.'); // Set message for empty search
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-gold">Explore Clubs, People, or More</h2>

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
                      <Card className="p-3 shadow-sm rounded">
                        <h6 className="text-info">{result.name || result.username}</h6>
                        <p className="text-muted">Type: {result.type}</p>
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
